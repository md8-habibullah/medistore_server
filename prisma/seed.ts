import { prisma } from '../lib/prisma.js';

async function main() {
  const adminEmail = 'admin@duck.com';
  
  console.log(`Looking for admin user with email: ${adminEmail}...`);
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!admin) {
    console.log(`Admin user ${adminEmail} not found!`);
    console.log(`Creating admin user: ${adminEmail}...`);
    admin = await prisma.user.create({
      data: {
        id: "admin-seed-id-123",
        name: "Admin User",
        email: adminEmail,
        role: "ADMIN",
        emailVerified: true,
      }
    });
  }

  console.log('Ensuring categories exist...');
  const categories = ['prescription', 'otc', 'supplement', 'device', 'cosmetic', 'others'];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { name: c },
      update: {},
      create: { name: c }
    });
  }

  console.log('Preparing 50 realistic medicine entries...');
  const medicinesData = [
    { name: 'Paracetamol 500mg', description: 'Standard pain reliever and fever reducer.', category: 'otc', price: 4.99, stock: 500, manufacturer: 'PharmaCorp', tags: ['painkiller', 'fever'] },
    { name: 'Ibuprofen 400mg', description: 'NSAID for pain, fever, and inflammation.', category: 'otc', price: 6.49, stock: 350, manufacturer: 'HealthPlus', tags: ['nsaid', 'pain'] },
    { name: 'Amoxicillin 250mg', description: 'Penicillin antibiotic for infections.', category: 'prescription', price: 12.99, stock: 150, manufacturer: 'BioMed', tags: ['antibiotic'] },
    { name: 'Vitamin C 1000mg', description: 'Immune system support.', category: 'supplement', price: 9.99, stock: 600, manufacturer: 'NaturesBest', tags: ['vitamin'] },
    { name: 'Omeprazole 20mg', description: 'Treats acid reflux and GERD.', category: 'prescription', price: 15.49, stock: 200, manufacturer: 'GastricCare', tags: ['stomach'] },
    { name: 'Loratadine 10mg', description: 'Non-drowsy allergy relief.', category: 'otc', price: 8.99, stock: 400, manufacturer: 'AllergyFree', tags: ['allergy'] },
    { name: 'Cetirizine 10mg', description: 'Antihistamine for allergies.', category: 'otc', price: 7.99, stock: 450, manufacturer: 'AllergyFree', tags: ['allergy'] },
    { name: 'Digital Thermometer', description: 'Fast and accurate temperature reading.', category: 'device', price: 14.99, stock: 100, manufacturer: 'MedTech', tags: ['device'] },
    { name: 'Blood Pressure Monitor', description: 'Automatic upper arm monitor.', category: 'device', price: 45.00, stock: 50, manufacturer: 'HeartCare', tags: ['device'] },
    { name: 'Multivitamin Complex', description: 'Complete daily nutrition.', category: 'supplement', price: 18.50, stock: 300, manufacturer: 'VitaLife', tags: ['vitamin'] },
    { name: 'Aspirin 81mg', description: 'Low dose for heart health.', category: 'otc', price: 5.49, stock: 800, manufacturer: 'CardioPharma', tags: ['heart'] },
    { name: 'Metformin 500mg', description: 'Controls blood sugar levels.', category: 'prescription', price: 10.99, stock: 250, manufacturer: 'DiabCare', tags: ['diabetes'] },
    { name: 'Atorvastatin 20mg', description: 'Lowers cholesterol.', category: 'prescription', price: 22.00, stock: 180, manufacturer: 'HeartPharma', tags: ['cholesterol'] },
    { name: 'Melatonin 5mg', description: 'Natural sleep aid.', category: 'supplement', price: 7.50, stock: 500, manufacturer: 'SleepWell', tags: ['sleep'] },
    { name: 'Fish Oil 1000mg', description: 'Omega-3 for heart and joints.', category: 'supplement', price: 14.99, stock: 400, manufacturer: 'OceanHealth', tags: ['omega3'] },
    { name: 'Pulse Oximeter', description: 'Measures blood oxygen.', category: 'device', price: 25.99, stock: 120, manufacturer: 'MedTech', tags: ['device'] },
    { name: 'First Aid Kit', description: 'Emergency medical supplies.', category: 'others', price: 19.99, stock: 200, manufacturer: 'SafetyFirst', tags: ['emergency'] },
    { name: 'Hydrocortisone Cream 1%', description: 'Relieves itching and swelling.', category: 'otc', price: 6.99, stock: 300, manufacturer: 'DermaCare', tags: ['skin'] },
    { name: 'Antibacterial Bandages', description: 'Sterile adhesive bandages.', category: 'others', price: 4.50, stock: 600, manufacturer: 'WoundCare', tags: ['bandage'] },
    { name: 'Cough Syrup 200ml', description: 'Soothing relief for coughs.', category: 'otc', price: 8.50, stock: 350, manufacturer: 'RespiraMed', tags: ['cough'] },
  ];

  for (const med of medicinesData) {
    await prisma.medicine.upsert({
      where: { id: `seed-${med.name.replace(/\s+/g, '-').toLowerCase()}` },
      update: { ...med, sellerID: admin.id },
      create: { 
        id: `seed-${med.name.replace(/\s+/g, '-').toLowerCase()}`,
        ...med, 
        sellerID: admin.id 
      }
    });
  }

  console.log('Creating dummy users for reviews...');
  const reviewers = [
    { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
    { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: 'user-3', name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 'user-4', name: 'Bob Brown', email: 'bob@example.com' },
  ];

  for (const user of reviewers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, role: 'CUSTOMER' }
    });
  }

  console.log('Adding reviews to medicines...');
  const reviewComments = [
    "Excellent product, works exactly as described.",
    "Very effective and affordable.",
    "Fast relief, highly recommended.",
    "Good quality, will buy again.",
    "Satisfied with the results.",
    "A must-have in every medicine cabinet.",
    "Helped me a lot with my symptoms.",
    "Great value for money.",
    "Trusted brand, reliable results.",
    "Very pleased with this purchase."
  ];

  const allMedicines = await prisma.medicine.findMany();
  for (const med of allMedicines) {
    // Add 2-4 reviews for each medicine
    const numReviews = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numReviews; i++) {
      const user = reviewers[Math.floor(Math.random() * reviewers.length)];
      const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
      const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];

      await prisma.review.create({
        data: {
          rating,
          comment,
          userId: user.id,
          medicineId: med.id
        }
      });
    }
  }

  console.log('\n✅ Successfully seeded categories, medicines, users, and reviews!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

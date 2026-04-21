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
  const categoryNames = [
    'Allergy', 
    "Children's Medicine", 
    'Cold & Flu', 
    'cosmetic', 
    'device', 
    'Digestive Health', 
    'First Aid', 
    'otc', 
    'others', 
    'Pain Relief', 
    'prescription', 
    'Skin Care', 
    'supplement', 
    'Vitamins & Supplements'
  ];

  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  console.log('Preparing bulk medicine entries...');
  const medicinesData = [
    // Allergy
    { name: 'Claritin 10mg', description: 'Non-drowsy allergy relief tablets.', category: 'Allergy', price: 12.99, stock: 200, manufacturer: 'Bayer', tags: ['allergy', 'antihistamine'] },
    { name: 'Zyrtec Tablets', description: 'Fast-acting allergy relief.', category: 'Allergy', price: 14.50, stock: 150, manufacturer: 'McNeil', tags: ['allergy', 'fast-relief'] },
    { name: 'Benadryl Allergy', description: 'Relieves sneezing and itchy eyes.', category: 'Allergy', price: 9.99, stock: 300, manufacturer: 'Kenvue', tags: ['allergy', 'drowsy'] },
    { name: 'Allegra Adult', description: '24-hour non-drowsy allergy relief.', category: 'Allergy', price: 18.99, stock: 120, manufacturer: 'Sanofi', tags: ['allergy', 'long-lasting'] },
    { name: 'Flonase Sensimist', description: 'Allergy nasal spray for full relief.', category: 'Allergy', price: 22.49, stock: 80, manufacturer: 'GSK', tags: ['allergy', 'nasal-spray'] },

    // Children's Medicine
    { name: "Children's Tylenol", description: 'Cherry flavored pain and fever relief.', category: "Children's Medicine", price: 8.99, stock: 250, manufacturer: 'Johnson & Johnson', tags: ['children', 'fever'] },
    { name: "Children's Motrin", description: 'Berry flavored ibuprofen for kids.', category: "Children's Medicine", price: 9.49, stock: 180, manufacturer: 'McNeil', tags: ['children', 'ibuprofen'] },
    { name: "Children's Zyrtec", description: 'Grape syrup for kids allergy.', category: "Children's Medicine", price: 11.99, stock: 100, manufacturer: 'McNeil', tags: ['children', 'allergy'] },
    { name: "Pedia-Care Cold", description: 'Multi-symptom cold relief for children.', category: "Children's Medicine", price: 7.99, stock: 150, manufacturer: 'MedTech', tags: ['children', 'cold'] },
    { name: "Gummy Multivitamins", description: 'Fun gummy vitamins for growing kids.', category: "Children's Medicine", price: 12.00, stock: 200, manufacturer: 'VitaKids', tags: ['children', 'vitamins'] },

    // Cold & Flu
    { name: 'DayQuil Severe', description: 'Daytime cold and flu relief.', category: 'Cold & Flu', price: 13.99, stock: 300, manufacturer: 'Vicks', tags: ['cold', 'flu', 'daytime'] },
    { name: 'NyQuil Nighttime', description: 'Relieves cold symptoms for better sleep.', category: 'Cold & Flu', price: 13.99, stock: 300, manufacturer: 'Vicks', tags: ['cold', 'flu', 'nighttime'] },
    { name: 'Mucinex DM', description: 'Controls cough and thins mucus.', category: 'Cold & Flu', price: 16.50, stock: 150, manufacturer: 'Reckitt', tags: ['cold', 'cough'] },
    { name: 'Theraflu Tea', description: 'Hot liquid powder for flu relief.', category: 'Cold & Flu', price: 10.99, stock: 100, manufacturer: 'GSK', tags: ['flu', 'hot-tea'] },
    { name: 'Halls Lozenges', description: 'Menthol cough drops for sore throat.', category: 'Cold & Flu', price: 4.50, stock: 500, manufacturer: 'Mondelez', tags: ['cough', 'lozenges'] },

    // cosmetic
    { name: 'Cetaphil Cleanser', description: 'Gentle skin cleanser for all skin types.', category: 'cosmetic', price: 15.99, stock: 120, manufacturer: 'Galderma', tags: ['cleanser', 'skincare'] },
    { name: 'Neutrogena Sunscreen', description: 'Ultra sheer dry-touch SPF 55.', category: 'cosmetic', price: 11.49, stock: 200, manufacturer: 'Johnson & Johnson', tags: ['sunscreen', 'spf'] },
    { name: 'Aveeno Lotion', description: 'Daily moisturizing lotion with oatmeal.', category: 'cosmetic', price: 10.99, stock: 150, manufacturer: 'Kenvue', tags: ['lotion', 'moisturizer'] },
    { name: 'Eucerin Cream', description: 'Rich cream for very dry skin.', category: 'cosmetic', price: 13.99, stock: 90, manufacturer: 'Beiersdorf', tags: ['cream', 'dry-skin'] },

    // device
    { name: 'Omron BP Monitor', description: 'Automatic upper arm blood pressure monitor.', category: 'device', price: 49.99, stock: 50, manufacturer: 'Omron', tags: ['health', 'monitor'] },
    { name: 'Thermometer Digital', description: 'Instant-read body thermometer.', category: 'device', price: 12.00, stock: 150, manufacturer: 'Braun', tags: ['health', 'thermometer'] },
    { name: 'Pulse Oximeter Pro', description: 'Measures heart rate and oxygen levels.', category: 'device', price: 24.99, stock: 80, manufacturer: 'MedLine', tags: ['health', 'oximeter'] },
    { name: 'Nebulizer Machine', description: 'Portable compressor nebulizer for asthma.', category: 'device', price: 35.00, stock: 40, manufacturer: 'Philips', tags: ['health', 'asthma'] },

    // Digestive Health
    { name: 'Tums Antacid', description: 'Extra strength berry flavored antacid.', category: 'Digestive Health', price: 6.99, stock: 300, manufacturer: 'GSK', tags: ['stomach', 'antacid'] },
    { name: 'Pepto Bismol', description: 'Relieves upset stomach and nausea.', category: 'Digestive Health', price: 8.50, stock: 250, manufacturer: 'P&G', tags: ['stomach', 'nausea'] },
    { name: 'Imodium AD', description: 'Anti-diarrheal liquid caplets.', category: 'Digestive Health', price: 11.99, stock: 150, manufacturer: 'Kenvue', tags: ['stomach', 'diarrhea'] },
    { name: 'Prilosec OTC', description: 'Acid reducer for frequent heartburn.', category: 'Digestive Health', price: 23.49, stock: 100, manufacturer: 'P&G', tags: ['heartburn', 'acid'] },
    { name: 'Metamucil Fiber', description: 'Psyllium husk fiber supplement.', category: 'Digestive Health', price: 19.99, stock: 120, manufacturer: 'P&G', tags: ['fiber', 'digestion'] },

    // First Aid
    { name: 'Band-Aid Variety', description: 'Assorted sterile bandages.', category: 'First Aid', price: 5.99, stock: 400, manufacturer: 'Kenvue', tags: ['emergency', 'bandages'] },
    { name: 'Neosporin Ointment', description: 'Triple antibiotic infection protection.', category: 'First Aid', price: 7.49, stock: 200, manufacturer: 'Kenvue', tags: ['emergency', 'antibiotic'] },
    { name: 'Hydrogen Peroxide', description: 'Antiseptic for minor cuts.', category: 'First Aid', price: 2.99, stock: 500, manufacturer: 'Major', tags: ['emergency', 'antiseptic'] },
    { name: 'Gauze Pads 4x4', description: 'Sterile large gauze pads.', category: 'First Aid', price: 6.50, stock: 150, manufacturer: 'MedLine', tags: ['emergency', 'gauze'] },
    { name: 'Medical Tape', description: 'Breathable paper surgical tape.', category: 'First Aid', price: 3.99, stock: 250, manufacturer: '3M', tags: ['emergency', 'tape'] },

    // otc
    { name: 'Advil Liqui-Gels', description: 'Fast-acting pain and fever relief.', category: 'otc', price: 14.99, stock: 300, manufacturer: 'Pfizer', tags: ['pain', 'ibuprofen'] },
    { name: 'Bayer Aspirin', description: 'The original heart health aspirin.', category: 'otc', price: 7.99, stock: 400, manufacturer: 'Bayer', tags: ['pain', 'aspirin'] },
    { name: 'Aleve Tablets', description: 'Naproxen sodium for all-day pain relief.', category: 'otc', price: 15.49, stock: 250, manufacturer: 'Bayer', tags: ['pain', 'aleve'] },
    { name: 'Excedrin Migraine', description: 'Fast relief for severe headaches.', category: 'otc', price: 12.99, stock: 180, manufacturer: 'GSK', tags: ['pain', 'migraine'] },

    // Pain Relief
    { name: 'Biofreeze Gel', description: 'Cooling topical pain reliever.', category: 'Pain Relief', price: 11.99, stock: 150, manufacturer: 'Reckitt', tags: ['pain', 'muscle'] },
    { name: 'Icy Hot Patch', description: 'Medicated patches for back and neck.', category: 'Pain Relief', price: 8.99, stock: 200, manufacturer: 'Sanofi', tags: ['pain', 'patch'] },
    { name: 'Voltaren Arthritis', description: 'Prescription-strength arthritis gel.', category: 'Pain Relief', price: 19.99, stock: 100, manufacturer: 'GSK', tags: ['pain', 'arthritis'] },
    { name: 'Aspercreme Lidocaine', description: 'Numb pain with 4% lidocaine.', category: 'Pain Relief', price: 10.49, stock: 140, manufacturer: 'Sanofi', tags: ['pain', 'numbing'] },

    // prescription
    { name: 'Amoxicillin 500mg', description: 'Broad spectrum antibiotic (Requires RX).', category: 'prescription', price: 15.00, stock: 100, manufacturer: 'Generic', tags: ['antibiotic', 'rx'] },
    { name: 'Metformin HCl', description: 'Type 2 diabetes medication (Requires RX).', category: 'prescription', price: 20.00, stock: 150, manufacturer: 'Generic', tags: ['diabetes', 'rx'] },
    { name: 'Lisinopril 10mg', description: 'Blood pressure medication (Requires RX).', category: 'prescription', price: 12.50, stock: 200, manufacturer: 'Generic', tags: ['bp', 'rx'] },
    { name: 'Atorvastatin 40mg', description: 'Cholesterol lowering medication (Requires RX).', category: 'prescription', price: 30.00, stock: 120, manufacturer: 'Generic', tags: ['cholesterol', 'rx'] },

    // Skin Care
    { name: 'La Roche-Posay SPF', description: 'Anthelios melt-in milk sunscreen.', category: 'Skin Care', price: 25.99, stock: 80, manufacturer: 'L\'Oreal', tags: ['skincare', 'sun'] },
    { name: 'CeraVe Moisturizer', description: 'Daily moisturizing cream with ceramides.', category: 'Skin Care', price: 18.50, stock: 150, manufacturer: 'L\'Oreal', tags: ['skincare', 'moisturizer'] },
    { name: 'Paula\'s Choice BHA', description: 'Skin perfecting exfoliant.', category: 'Skin Care', price: 34.00, stock: 60, manufacturer: 'Paula\'s Choice', tags: ['skincare', 'exfoliant'] },
    { name: 'Hydro Boost Gel', description: 'Water gel for intense hydration.', category: 'Skin Care', price: 16.99, stock: 200, manufacturer: 'Neutrogena', tags: ['skincare', 'hydration'] },

    // supplement
    { name: 'Vitamin D3 5000IU', description: 'Supports bone and immune health.', category: 'supplement', price: 12.99, stock: 400, manufacturer: 'Now Foods', tags: ['vitamins', 'health'] },
    { name: 'Magnesium Glycinate', description: 'Promotes relaxation and sleep.', category: 'supplement', price: 18.00, stock: 250, manufacturer: 'Pure Encapsulations', tags: ['minerals', 'sleep'] },
    { name: 'Zinc 50mg', description: 'Immune support supplement.', category: 'supplement', price: 8.49, stock: 350, manufacturer: 'Nature Made', tags: ['minerals', 'immune'] },

    // Vitamins & Supplements
    { name: 'Garden of Life Multivitamin', description: 'Whole food multivitamin for men.', category: 'Vitamins & Supplements', price: 35.99, stock: 100, manufacturer: 'Garden of Life', tags: ['vitamins', 'men'] },
    { name: 'Women\'s One Daily', description: 'Complete multivitamin for women.', category: 'Vitamins & Supplements', price: 28.50, stock: 150, manufacturer: 'New Chapter', tags: ['vitamins', 'women'] },
    { name: 'Omega-3 Fish Oil', description: 'High potency heart and brain support.', category: 'Vitamins & Supplements', price: 22.00, stock: 200, manufacturer: 'Nordic Naturals', tags: ['supplements', 'heart'] },
    { name: 'Probiotic 50 Billion', description: 'Digestive and immune system support.', category: 'Vitamins & Supplements', price: 32.99, stock: 90, manufacturer: 'Renew Life', tags: ['supplements', 'probiotic'] },
  ];

  for (const med of medicinesData) {
    const id = `seed-${med.name.replace(/\s+/g, '-').replace(/['"]/g, '').toLowerCase()}`;
    await prisma.medicine.upsert({
      where: { id },
      update: { ...med, sellerID: admin.id },
      create: { 
        id,
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
    { id: 'user-5', name: 'Charlie Davis', email: 'charlie@example.com' },
    { id: 'user-6', name: 'Diana Evans', email: 'diana@example.com' },
  ];

  for (const user of reviewers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, role: 'CUSTOMER' }
    });
  }

  console.log('Adding random reviews to medicines...');
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
    "Very pleased with this purchase.",
    "The best in its category.",
    "Delivery was fast and product is fresh.",
    "Highly effective for my condition.",
    "Will definitely reorder soon."
  ];

  const allMedicines = await prisma.medicine.findMany();
  
  // Clear old reviews to avoid duplicates if re-seeding
  await prisma.review.deleteMany({
    where: {
      userId: { in: reviewers.map(u => u.id) }
    }
  });

  for (const med of allMedicines) {
    // Add 1-4 reviews for each medicine
    const numReviews = Math.floor(Math.random() * 4) + 1;
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

  console.log(`\n✅ Successfully seeded ${categoryNames.length} categories, ${allMedicines.length} medicines, and reviews!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

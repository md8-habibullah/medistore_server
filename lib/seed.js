import prisma from './prisma.js';

const results = async function seed() {
    await prisma.categories.upsert({
        // medicine category name only
        data: [
            { name: "Pain Relief" },
            { name: "Cold & Flu" },
            { name: "Allergy" },
            { name: "Digestive Health" },
            { name: "Vitamins & Supplements" },
            { name: "Skin Care" },
            { name: "First Aid" },
            { name: "Children's Medicine" }
        ]
    });
}

seed().then(() => {
    console.log("Seeding completed.");
    process.exit(0);
}).catch((error) => {
    console.error("Error seeding data:", error);
    process.exit(1);
});

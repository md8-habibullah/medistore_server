import { prisma } from './prisma.js';

const categories = [
    { name: "others" },
    { name: "Pain Relief" },
    { name: "Cold & Flu" },
    { name: "Allergy" },
    { name: "Digestive Health" },
    { name: "Vitamins & Supplements" },
    { name: "Skin Care" },
    { name: "First Aid" },
    { name: "Children's Medicine" }
];

const seed = async () => {
    await prisma.category.createMany({
        data: categories,
        skipDuplicates: true,
    });
};

seed().then(() => {
    console.log("Seeding completed.");
    process.exit(0);
}).catch((error) => {
    console.error("Error seeding data:", error);
    process.exit(1);
});
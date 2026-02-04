import { prisma } from "../lib/prisma"
import app from "./app";

const port = process.env.PORT ?? 5050;

const main = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully.');
        app.listen(port, () => {
            console.log('Server is running on port :', port);
        });

    } catch (error) {
        console.error('Error starting the server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }

};

main();
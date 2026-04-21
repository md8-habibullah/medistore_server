import { prisma } from "../lib/prisma"
import app from "./app";

const port = process.env.PORT ?? 5050;

const main = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully.');
        // if (process.env.NODE_ENV !== 'production') {
        app.listen(port, () => {
            console.log('MediStore Backend is running on port :', port);
        });
        // } else {
        //     console.log('Running in production mode. Server is not started.');
        // }

    } catch (error) {
        console.error('Error starting the server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }

};

main();
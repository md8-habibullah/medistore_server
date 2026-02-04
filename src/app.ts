import express, { type Application } from 'express';
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { medicineRouter } from './modules/medicine/medicine.router';
import { auth } from '../lib/auth';

const app: Application = express();

app.use(cors({
    origin: process.env.FRONTEND_APP_URL || 'http://localhost:3000',
    credentials: true,
}));
// mount the auth router to handle all authentication-related routes
app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running');
});

app.use("/medicine", medicineRouter);



export default app;
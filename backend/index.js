import express from "express";
import cors from 'cors';
import morgan from "morgan";
import dotenv from 'dotenv';
import helmet from "helmet";
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from "./utils/swagger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import {limiter} from './middlewares/rateLimiter.js'
import authRoute from './routes/auth.js';
import transactionsRoute from './routes/transactions.js'
import AdminRoute from './routes/admin.js';
import userRoute from './routes/users.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(limiter)

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
// Routes
app.use('/api/auth', authRoute)
app.use('/api/transactions', transactionsRoute)
app.use('/api/users', userRoute);
app.use('/api/admin', AdminRoute)

app.use('/api/', (req, res) => {
    res.send('Welcome to the Expense Tracker API v1.0.0');
})

// Server frontend in production
if (process.env.NODE_ENV === "production") {

    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // Serve the frontend app

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

}

app.use(notFound)

app.use(errorHandler)

mongoose.connect(process.env.NODE_ENV === 'development' ? process.env.MONGO_URI_DEV : process.env.MONGO_URI_PRO )
            .then(() => {
                console.log('Connected to MongoDB');
            }).catch(err =>{
                console.error('MongoDB connection error:', err);
            })

app.listen(PORT, ()=>{
     console.log(`The server is running on http://localhost:${PORT}`);
})
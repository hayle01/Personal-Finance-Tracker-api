import express from "express";
import cors from 'cors';
import morgan from "morgan";
import dotenv from 'dotenv';
import helmet from "helmet";
import mongoose from "mongoose";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from "./utils/swagger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import {limiter} from './middlewares/rateLimiter.js'
import authRoute from './routes/auth.js';
import transactionsRoute from './routes/transactions.js'
import AdminRoute from './routes/admin.js'

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

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
// Routes
app.use('/auth', authRoute)
app.use('/transactions', transactionsRoute)
app.use('/admin', AdminRoute)


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
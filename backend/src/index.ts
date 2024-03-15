import express, { Request, Response } from 'express';
import cors from 'cors'; 
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import userRoutes from './routes/users'
import authRoutes from './routes/auth'

dotenv.config();
mongoose.connect(process.env.MONGO_CONECTION_STRING as string)

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)


app.listen(8000, () => {
    console.log("Server is running at localhost:8000");
});

//9y0zsiFD8Buj5QwM
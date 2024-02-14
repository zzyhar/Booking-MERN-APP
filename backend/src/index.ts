import express, { Request, Response } from 'express';
import cors from 'cors'; 
import dotenv from 'dotenv';
import mongoose from 'mongoose'

dotenv.config();
mongoose.connect(process.env.MONGO_CONECTION_STRING as string)

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/test", async(req: Request, res: Response) => {
    res.json({ message: "Hello from express endpoint!" });
});

app.listen(8000, () => {
    console.log("Server is running at localhost:8000");
});

//9y0zsiFD8Buj5QwM
import express from 'express';
import "dotenv/config";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';


const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Enable CORS with credentials

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
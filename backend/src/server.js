import express from 'express';
import "dotenv/config";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import path from "path";


const app = express();
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Enable CORS with credentials

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use("/api/auth", authRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  });
}

app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
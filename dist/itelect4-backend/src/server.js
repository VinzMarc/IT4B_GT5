import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { authMiddleware } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import aiRoutes from "../../GT5 API/ai.js";
import { requireAuth } from "../../GT5 API/requireAuth.js";
import itemRoutes from "./routes/items.js";
dotenv.config();
const app = express();
const port = Number(process.env.PORT ?? 4000);
app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) => {
    res.json({ ok: true, message: "ITeLect4 backend is running" });
});
app.use("/api/auth", authRoutes);
app.use("/api/ai", requireAuth, aiRoutes);
app.use("/api/items", authMiddleware, itemRoutes);
const startServer = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri || mongoUri.includes("<username>") || mongoUri.includes("<password>")) {
        console.warn("MONGO_URI is not configured. Starting in demo mode without MongoDB.");
    }
    else {
        try {
            await mongoose.connect(mongoUri);
            console.log("MongoDB connected");
        }
        catch (error) {
            console.warn("MongoDB connection failed. Continuing in demo mode.", error instanceof Error ? error.message : error);
        }
    }
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
};
startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});

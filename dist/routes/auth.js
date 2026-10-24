import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Router } from "express";
import User from "../models/User.js";
const router = Router();
const jwtSecret = process.env.JWT_SECRET ?? "dev-secret";
const inMemoryUsers = [];
const ensureDemoUser = () => {
    if (!inMemoryUsers.some((user) => user.email === "demo@example.com")) {
        inMemoryUsers.push({
            _id: "demo-user",
            name: "Demo User",
            email: "demo@example.com",
            password: bcrypt.hashSync("demo123", 10),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    }
};
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (mongoose.connection.readyState !== 1) {
        ensureDemoUser();
        const existingUser = inMemoryUsers.find((user) => user.email === normalizedEmail);
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const newUser = {
            _id: `${Date.now()}`,
            name: name.trim(),
            email: normalizedEmail,
            password: await bcrypt.hash(password, 10),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        inMemoryUsers.push(newUser);
        const token = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: "7d" });
        return res.status(201).json({
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
        });
    }
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
    });
    const token = jwt.sign({ userId: user._id.toString() }, jwtSecret, { expiresIn: "7d" });
    return res.status(201).json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    if (mongoose.connection.readyState !== 1) {
        ensureDemoUser();
        const user = inMemoryUsers.find((entry) => entry.email === email.toLowerCase().trim());
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "7d" });
        return res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id.toString() }, jwtSecret, { expiresIn: "7d" });
    return res.json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
});
export default router;

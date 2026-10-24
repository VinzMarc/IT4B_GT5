import mongoose from "mongoose";
import { Router } from "express";
import Item from "../models/Item.js";
const router = Router();
const inMemoryItems = [
    {
        _id: "demo-item-1",
        title: "Black backpack",
        description: "Found near the library entrance",
        location: "Library",
        type: "lost",
        isClaimed: false,
        userId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "demo-item-2",
        title: "Silver keychain",
        description: "Recovered in the engineering building",
        location: "Engineering building",
        type: "found",
        isClaimed: false,
        userId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
const isMongoReady = () => mongoose.connection.readyState === 1;
router.get("/", async (req, res) => {
    if (!isMongoReady()) {
        const items = inMemoryItems.filter((item) => !req.userId || item.userId === req.userId);
        return res.json(items);
    }
    const items = await Item.find({ ...(req.userId ? { userId: req.userId } : {}) }).sort({ createdAt: -1 });
    return res.json(items);
});
router.get("/:id", async (req, res) => {
    if (!isMongoReady()) {
        const item = inMemoryItems.find((entry) => entry._id === req.params.id && (!req.userId || entry.userId === req.userId));
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        return res.json(item);
    }
    const item = await Item.findOne({ _id: req.params.id, ...(req.userId ? { userId: req.userId } : {}) });
    if (!item) {
        return res.status(404).json({ message: "Item not found" });
    }
    return res.json(item);
});
router.post("/", async (req, res) => {
    const { title, description, location, type, isClaimed } = req.body;
    if (!title || !description || !location || !type) {
        return res.status(400).json({ message: "Title, description, location, and type are required" });
    }
    if (!isMongoReady()) {
        const newItem = {
            _id: `${Date.now()}`,
            title,
            description,
            location,
            type,
            isClaimed: Boolean(isClaimed),
            userId: req.userId ?? "demo-user",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        inMemoryItems.unshift(newItem);
        return res.status(201).json(newItem);
    }
    const item = await Item.create({
        title,
        description,
        location,
        type,
        isClaimed: Boolean(isClaimed),
        userId: req.userId,
    });
    return res.status(201).json(item);
});
router.put("/:id", async (req, res) => {
    if (!isMongoReady()) {
        const itemIndex = inMemoryItems.findIndex((entry) => entry._id === req.params.id && (!req.userId || entry.userId === req.userId));
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found" });
        }
        inMemoryItems[itemIndex] = {
            ...inMemoryItems[itemIndex],
            ...req.body,
            updatedAt: new Date().toISOString(),
            userId: req.userId ?? inMemoryItems[itemIndex].userId,
        };
        return res.json(inMemoryItems[itemIndex]);
    }
    const item = await Item.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { ...req.body, userId: req.userId }, { new: true, runValidators: true });
    if (!item) {
        return res.status(404).json({ message: "Item not found" });
    }
    return res.json(item);
});
router.delete("/:id", async (req, res) => {
    if (!isMongoReady()) {
        const itemIndex = inMemoryItems.findIndex((entry) => entry._id === req.params.id && (!req.userId || entry.userId === req.userId));
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found" });
        }
        const [deletedItem] = inMemoryItems.splice(itemIndex, 1);
        return res.json({ message: "Item deleted", item: deletedItem });
    }
    const item = await Item.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!item) {
        return res.status(404).json({ message: "Item not found" });
    }
    return res.json({ message: "Item deleted", item });
});
export default router;

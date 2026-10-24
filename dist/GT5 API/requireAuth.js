import jwt from "jsonwebtoken";
export function requireAuth(req, res, next) {
    const hasBearerToken = req.headers.authorization?.startsWith("Bearer ") ?? false;
    const token = hasBearerToken ? req.headers.authorization?.split(" ")[1] : undefined;
    if (!token) {
        return res.status(401).json({ message: "Missing or invalid bearer token" });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET ?? "dev-secret");
        req.userId = payload.userId;
        return next();
    }
    catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

import jwt from "jsonwebtoken";
function authenticate(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return false;
    }
    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET ?? "dev-secret";
    try {
        const payload = jwt.verify(token, jwtSecret);
        req.userId = payload.userId;
        return true;
    }
    catch {
        return false;
    }
}
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const hasBearerToken = authHeader?.startsWith("Bearer ") ?? false;
    if (!hasBearerToken && req.method === "GET") {
        return next();
    }
    if (!authenticate(req)) {
        return res.status(401).json({
            message: hasBearerToken ? "Invalid or expired token" : "Missing or invalid bearer token",
        });
    }
    return next();
}

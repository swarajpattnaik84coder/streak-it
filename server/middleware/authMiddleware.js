import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "streak_it_super_secret_jwt_key_2026";

export const protect = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ status: "error", message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ status: "error", message: "Not authorized, invalid token" });
  }
};

export { JWT_SECRET };

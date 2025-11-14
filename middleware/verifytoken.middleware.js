import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const openRoutes = ["/api/v1/auth/login", "/api/v1/auth/register"];

    if (openRoutes.includes(req.originalUrl)) {
      return next();
    }
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or malformed token.",
    });
  }
};

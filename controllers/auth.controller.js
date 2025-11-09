import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Seller from "../model/sellers.model.js";
import User from "../model/user.model.js";

const models = { user: User, seller: Seller };

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (!models[role]) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    const Model = models[role];
    const existing = await Model.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await Model.create({ name, email, password: hashPassword, role });

    return res
      .status(201)
      .json({ success: true, message: "Registered successfully." });
  } catch (err) {
    console.error("Register Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error during registration." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    let user = null;
    let role = null;

    for (const [key, Model] of Object.entries(models)) {
      const found = await Model.findOne({ email });
      if (found) {
        user = found;
        role = key;
        break;
      }
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const token = generateToken({ userId: user._id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error during login." });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { userId, role } = req.user;
    console.log(role);
    const Model = models[role];

    if (!Model) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    const user = await Model.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully.",
      user,
    });
  } catch (err) {
    console.error("GetCurrentUser Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error fetching user." });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (err) {
    console.error("Logout Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error during logout." });
  }
};

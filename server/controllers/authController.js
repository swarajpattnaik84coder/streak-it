import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { JWT_SECRET } from "../middleware/authMiddleware.js";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      status: "success",
      token,
      user: userObj,
    });
};

export const register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ status: "error", message: "Please provide all required fields" });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ status: "error", message: "Username or email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      name: name || username,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "error", message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const logout = (_req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success", message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    res.status(200).json({ status: "success", user });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const demoLogin = async (_req, res) => {
  try {
    let user = await User.findOne({ username: "aeldric" });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("demo12345", salt);
      user = await User.create({
        username: "aeldric",
        email: "aeldric@realm.io",
        password: hashedPassword,
        name: "Aeldric",
        class: "Shadow Warden",
        level: 7,
        xp: 1340,
        xpToNext: 1500,
        currency: 840,
        streak: 14,
        unallocatedStatPoints: 3,
      });
    }
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

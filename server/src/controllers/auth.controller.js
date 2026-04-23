import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

/* ================= GOOGLE SUCCESS ================= */

export const googleAuthSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("http://localhost:5173/login");
    }

    const token = jwt.sign(
      {
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.redirect(
      `http://localhost:5173/auth/success?token=${token}`
    );
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.redirect("http://localhost:5173/login");
  }
};

/* ================= REGISTER ================= */

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        provider: "local",
      },
    });

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ token, user });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= LOGIN ================= */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};
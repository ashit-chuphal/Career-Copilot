import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

/* ================= GOOGLE SUCCESS ================= */

export const googleAuthSuccess = async (req, res) => {
  try {
    console.log("GOOGLE AUTH SUCCESS HANDLER HIT");
    console.log("REQ.USER =", req.user);

    if (!req.user) {
      console.log("[GOOGLE_AUTH_FAILED] req.user is missing");

      return res.redirect(
        `${process.env.CLIENT_URL}/login`
      );
    }

    console.log(
      `[GOOGLE_AUTH_SUCCESS] ${req.user.email}`
    );

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
      `${process.env.CLIENT_URL}/auth/success?token=${token}`
    );
  } catch (error) {
    console.error(
      `[GOOGLE_AUTH_ERROR] ${error.message}`
    );
    console.error(error.stack);

    return res.redirect(
      `${process.env.CLIENT_URL}/login`
    );
  }
};

/* ================= REGISTER ================= */

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    console.log(
      `[REGISTER_ATTEMPT] ${email}`
    );

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.warn(
        `[REGISTER_FAILED] User already exists: ${email}`
      );

      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        provider: "local",
      },
    });

    console.log(
      `[REGISTER_SUCCESS] ${email}`
    );

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    console.error(
      `[REGISTER_ERROR] ${error.message}`
    );
    console.error(error.stack);

    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

/* ================= LOGIN ================= */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    console.log(
      `[LOGIN_ATTEMPT] ${email}`
    );

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      console.warn(
        `[LOGIN_FAILED] User not found: ${email}`
      );

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      console.warn(
        `[LOGIN_FAILED] Invalid password: ${email}`
      );

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    console.log(
      `[LOGIN_SUCCESS] ${email}`
    );

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    console.error(
      `[LOGIN_ERROR] ${error.message}`
    );
    console.error(error.stack);

    return res.status(500).json({
      message: "Login failed",
    });
  }
};
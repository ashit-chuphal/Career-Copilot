import express from "express";
import passport from "passport";

import {
  googleAuthSuccess,
  register,
  login,
} from "../controllers/auth.controller.js";

const router = express.Router();

/* ===== EMAIL AUTH ===== */
router.post("/register", register);
router.post("/login", login);

/* ===== GOOGLE AUTH ===== */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false,
  }),
  googleAuthSuccess
);

export default router;
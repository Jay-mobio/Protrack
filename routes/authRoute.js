import express from "express";
import { login, resetEmail, resetPassword, verifyOtp } from "../controller/index.js";

const router = express.Router();

router.post("/login",login)
router.post("/reset-email",resetEmail)
router.post("/verify-otp", verifyOtp)
router.put("/reset-pssword", resetPassword)

export {router as authRouter}
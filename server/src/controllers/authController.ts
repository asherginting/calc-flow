import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import prisma from "../prisma";
import bcrypt from "bcryptjs";

// Helper untuk mengirim cookie (tetap di controller karena urusan HTTP)
const sendTokenCookie = (userId: string, statusCode: number, res: Response, userData: any) => {
  const token = AuthService.generateToken(userId);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user: userData,
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    // Panggil Service untuk urusan Database & Logic
    const newUser = await AuthService.registerUser(req.body);

    // Kirim Response
    sendTokenCookie(newUser.id, 201, res, {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    });
  } catch (error: any) {
    if (error.message === "EMAIL_EXISTS") {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Cari user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Kirim Response
    sendTokenCookie(user.id, 200, res, {
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};
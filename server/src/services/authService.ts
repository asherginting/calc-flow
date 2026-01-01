import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

export const AuthService = {
  async registerUser(data: any) {
    const { username, email, password } = data;
    
    // Cek email duplikat
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("EMAIL_EXISTS");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user
    return await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
  },

  generateToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });
  }
};
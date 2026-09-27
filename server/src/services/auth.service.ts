import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { Role } from "@prisma/client";

interface RegisterInput {
  email: string;
  password: string;
  role: Role;
  firstName: string;
  lastName: string;
  headline?: string;
  department?: string;
  graduationYear?: number;
}

export class AuthService {
  private static generateToken(user: { id: string; email: string; role: Role }) {
    const secret: jwt.Secret = process.env.JWT_SECRET || "super_secret_alumni_tracking_jwt_key_2026";
    const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"];

    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn }
    );
  }

  static async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (existing) {
      const error: any = new Error("Bu e-posta adresi zaten kullanımda.");
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        passwordHash,
        role: data.role,
        isVerified: data.role === Role.STUDENT ? true : false, // Alumni requires verification or auto
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            headline: data.headline,
          },
        },
        ...(data.department && data.graduationYear
          ? {
              academicHistories: {
                create: {
                  university: "İstanbul Üniversitesi",
                  faculty: "Mühendislik Fakültesi",
                  department: data.department,
                  startYear: data.graduationYear - 4,
                  graduationYear: data.graduationYear,
                },
              },
            }
          : {}),
      },
      include: {
        profile: true,
        academicHistories: true,
      },
    });

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profile: user.profile,
      },
    };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        profile: true,
      },
    });

    if (!user) {
      const error: any = new Error("Geçersiz e-posta veya şifre.");
      error.statusCode = 401;
      throw error;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      const error: any = new Error("Geçersiz e-posta veya şifre.");
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profile: user.profile,
      },
    };
  }

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        avatarUrl: true,
        createdAt: true,
        profile: true,
        academicHistories: {
          orderBy: { graduationYear: "desc" },
        },
        workExperiences: {
          orderBy: { startDate: "desc" },
        },
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!user) {
      const error: any = new Error("Kullanıcı bulunamadı.");
      error.statusCode = 404;
      throw error;
    }

    return user;
  }
}

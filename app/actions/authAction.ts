"use server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUserSchema, loginUserSchema } from "@/utils/zod";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Function to register a new user
export async function registerUser(request: Request) {
  try {
    const body = await request.json();
    const validation = createUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email Already Exists" },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    // Generate JWT token
    const token = jwt.sign({ email, userId: user.id }, JWT_SECRET, {
      expiresIn: "30d",
    });

    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: { email: user.email },
        token,
      },
      { status: 201 }
    );

    // Set JWT cookie
    response.headers.set(
      "Set-Cookie",
      `jwt=${token}; HttpOnly; Path=/; Max-Age=${
        30 * 24 * 60 * 60
      }; SameSite=Strict; ${
        process.env.NODE_ENV !== "development" ? "Secure" : ""
      }`
    );

    return response;
  } catch (error) {
    console.error("Error in user registration:", error);
    return NextResponse.json(
      { error: "Failed to create User" },
      { status: 500 }
    );
  }
}

export async function loginUser(request: Request) {
  try {
    const body = await request.json();
    const validation = loginUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 401 }
      );
    }

    // check is password match

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid Password" }, { status: 404 });
    }

    // generate the jwt token

    const token = jwt.sign({ email, userId: user.id }, JWT_SECRET, {
      expiresIn: "30d",
    });

    const response = NextResponse.json(
      { message: "Login Successfully", user: { email: user.email }, token },
      { status: 200 }
    );

    // Set jwt cookie

    response.headers.set(
      "Set-Cookie",
      `jwt=${token}; HttpOnly; Path=/; Max-Age=${
        30 * 24 * 60 * 60
      }; SameSite=Strict; ${
        process.env.NODE_ENV !== "development" ? "Secure" : ""
      }`
    );
    return response;
  } catch (error) {
    console.log("Error While Signin the User", error);
    return NextResponse.json({ error: "Failed to Login" }, { status: 500 });
  }
}

// GetMe

export async function getMe(request: Request) {
  try {
    // get cookie from the jwt
    const cookie = request.headers.get("cookie");
    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("jwt="))
      ?.split("=")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthoried" }, { status: 401 });
    }
    // verify jwt
    const decode = jwt.verify(token, JWT_SECRET) as { userId: number };
    if (!decode || !decode.userId) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }
    // user from the db
    const user = await prisma.user.findUnique({
      where: { id: decode.userId },
      select: { id: true, email: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error in getMe:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// Logout

export async function logout() {
  try {
    const response = NextResponse.json(
      { message: "Logged out Successfully" },
      { status: 200 }
    );

    // clear the jwt cookie by setting max-age = 0
    response.headers.set("Set-Cookie", "jwt=; HttpOnly; Path=/; Max-Age=0;");
    return response;
  } catch (error) {
    console.log("error in Logout", error);
    return NextResponse.json(
      {
        error: "Failed to logout",
      },
      { status: 500 }
    );
  }
}

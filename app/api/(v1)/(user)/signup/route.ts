import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// zod schema for creating a user

const createUserSchema = z.object({
  email: z.string().email("Invalid Email Address"),
  password: z.string().min(8, "Password must be at least 8 character long"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createUserSchema.safeParse(body);

    // if validation fails, return a 400 error

    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error.errors,
        },
        { status: 400 }
      );
    }

    // if validation succeeds, create the users

    const { email, password } = validation.data;

    // check if the email already exist in the db?

    const isEmailExist = await prisma.user.findUnique({
      where: { email },
    });

    if (isEmailExist) {
      return NextResponse.json(
        { error: "Email Already Exist" },
        { status: 409 }
      );
    } // already check this in database level

    // hash the password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // hash the password generate the salt
    // bcrypt the password and then login
    // set cookie during signup
    // email regex
    // email already exist

    // creating the user

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // const secret = process.env.JWT_SECRET || "sup3rS3c3t";
    // const token = jwt.sign({ email, userId: user.id }, secret); // Include userId in the payload

    // Generate JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({ email, userId: user.id }, secret, {
      expiresIn: "30d", // Set token expiration
    });

    console.log("Token is", token);

    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: { email: user.email },
        token,
      },
      { status: 201 }
    );

    // Set cookie with proper method
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
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create User" },
      { status: 500 }
    );
  }
}

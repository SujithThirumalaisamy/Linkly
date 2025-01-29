import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

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

    // hash the password generate the salt
    // bcrypt the password and then login
    // set cookie during signup
    // email regex
    // email already exist

    // creating the user

    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create User" },
      { status: 500 }
    );
  }
}

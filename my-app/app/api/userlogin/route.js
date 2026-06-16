
import { connectionStr } from "@/app/(root)/lib/db";
import { User } from "@/app/(root)/lib/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const payload = await request.json();

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(connectionStr);
    }

    /*
    ==========================
    LOGIN
    ==========================
    */

    if (payload.login) {
      const user = await User.findOne({
        email: payload.email,
      });

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid email or password",
          },
          { status: 401 }
        );
      }

      const passwordMatched = await bcrypt.compare(
        payload.password,
        user.password
      );

      if (!passwordMatched) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid email or password",
          },
          { status: 401 }
        );
      }

      const userObj = user.toObject();
      delete userObj.password;

      return NextResponse.json(
        {
          success: true,
          result: userObj,
          message: "Login successful",
        },
        { status: 200 }
      );
    }

    /*
    ==========================
    SIGNUP
    ==========================
    */

    const {
      name,
      username,
      email,
      password,
      contact,
    } = payload;

    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !contact
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const existingEmail = await User.findOne({
      email,
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 409 }
      );
    }

    const existingUsername = await User.findOne({
      username,
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = new User({
      name,
      username,
      email,
      contact,
      password: hashedPassword,
    });

    const result = await user.save();

    const userObj = result.toObject();
    delete userObj.password;

    return NextResponse.json(
      {
        success: true,
        result: userObj,
        message: "Account created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Auth Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}


import { connectionStr } from "@/app/(root)/lib/db";
import { deliveryPartnersSchema } from "@/app/(root)/lib/models/Deleveryboy";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const payload = await request.json();

    await mongoose.connect(connectionStr);

    // Hash password
    const hashedPassword = await bcrypt.hash(
      payload.password,
      10
    );

    const user = new deliveryPartnersSchema({
      ...payload,
      password: hashedPassword,
    });

    const result = await user.save();

    return NextResponse.json({
      success: true,
      result,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
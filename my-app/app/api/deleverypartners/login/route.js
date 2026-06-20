import { connectionStr } from "@/app/(root)/lib/db";
import { deliveryPartnersSchema } from "@/app/(root)/lib/models/Deleveryboy";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const payload = await request.json();

    await mongoose.connect(connectionStr);

    const user =
      await deliveryPartnersSchema.findOne({
        mobile: payload.mobile,
      });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid Mobile or Password",
      });
    }

    const isMatch =
      await bcrypt.compare(
        payload.password,
        user.password
      );

    if (!isMatch) {
      return NextResponse.json({
        success: false,
        message: "Invalid Mobile or Password",
      });
    }

    const userObj = user.toObject();

    delete userObj.password;

    return NextResponse.json({
      success: true,
      result: userObj,
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
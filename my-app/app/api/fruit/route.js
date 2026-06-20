import { connectionStr } from "@/app/(root)/lib/db";
import Order from "@/app/(root)/lib/models/Order";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

   const userId = searchParams.get("userId");

if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    await mongoose.connect(connectionStr);

const result = await Order.find({ userId }).sort({
  createdAt: -1,
});

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

import { connectionStr } from "@/app/(root)/lib/db";
import Order from "@/app/(root)/lib/models/Order";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id"); 
    let success = false;

    if (!userId) {
      return NextResponse.json(
        { message: "id query parameter is required" },
        { status: 400 }
      );
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(connectionStr, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    const result = await Order.find({ id: userId }); 
    if (result.length > 0) success = true;

    return NextResponse.json({ result, success });
  } catch (error) {
    console.error("Error in GET /api/order/fruit:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

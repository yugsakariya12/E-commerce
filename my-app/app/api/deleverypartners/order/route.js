import { connectionStr } from "@/app/(root)/lib/db";
import { deliveryPartnersSchema } from "@/app/(root)/lib/models/Deleveryboy";
import Order from "@/app/(root)/lib/models/Order";
import mongoose from "mongoose";
import { NextResponse } from "next/server";



export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get("email");
    let success = false;

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(connectionStr, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    const result = await Order.find({ email: userId }); // ❌ no populate or mapping

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





export async function POST(request) {
  try {
    const payload = await request.json();
    await mongoose.connect(connectionStr, { useNewUrlParser: true });

    const newOrder = new Order(payload);
    const savedOrder = await newOrder.save();

    return NextResponse.json({ success: true, result: savedOrder });
  } catch (error) {
    console.error("Error saving order:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Order from "@/app/(root)/lib/models/Order";
import { connectionStr } from "@/app/(root)/lib/db";

export async function PUT(request) {
  const { orderId, status } = await request.json();

  try {
    await mongoose.connect(connectionStr);
    const updated = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

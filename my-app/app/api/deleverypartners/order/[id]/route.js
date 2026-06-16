import mongoose from "mongoose";
import { connectionStr } from "@/app/(root)/lib/db";
import Order from "@/app/(root)/lib/models/Order";
import { NextResponse } from "next/server";

export async function GET(request, content) {
  const id = content.params.id;
  let success = false;

  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(connectionStr, { useNewUrlParser: true, useUnifiedTopology: true });

    // ✅ Use .lean() for plain JS objects that serialize cleanly
    const result = await Order.find({ deliveryBoyId: id }).lean();

    console.log("Fetched orders:", result);

    if (!result || result.length === 0) {
      return NextResponse.json({ success: false, message: "No orders found" }, { status: 404 });
    }

    success = true;
    return NextResponse.json({ success, result });

  } catch (err) {
    console.error("API error in delivery order fetch:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

import { connectionStr } from "@/app/(root)/lib/db";
import Order from "@/app/(root)/lib/models/Order";
import mongoose from "mongoose";
import { deliveryPartnersSchema } from "@/app/(root)/lib/models/Deleveryboy";
import { NextResponse } from "next/server";




export async function GET(request) {
  try {
    
    let success = false;

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(connectionStr, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
const Id = request.nextUrl.searchParams.get('id');
    const result = await Order.find({_id:Id}); // ❌ no populate or mapping


    
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





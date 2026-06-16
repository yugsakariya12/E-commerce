import { connectionStr } from "@/app/(root)/lib/db";
import { AdminSchema } from "@/app/(root)/lib/models/Admin";
import Order from "@/app/(root)/lib/models/Order";
import Post from "@/app/(root)/lib/models/Post";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(connectionStr);
    }

    // Get Admin
    const admin = await AdminSchema.findById(id);

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin not found",
        },
        { status: 404 }
      );
    }

    // Get all orders
    const orders = await Order.find({});

    const result = [];

    // Loop through orders
    for (const order of orders) {
      const products = await Post.find({
        _id: { $in: order.products },
        adminid: admin._id,
      });

      products.forEach((product) => {
        result.push({
          orderId: order._id,
          status: order.status,

          firstName: order.firstName,
          lastName: order.lastName,
          street: order.street,
          city: order.city,
          state: order.state,
          pincode: order.pincode,

          productId: product._id,
          productName: product.Name,
          price: product.Price,
          image: product.postPhotos?.[0] || null,
        });
      });
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Order Fetch Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectionStr } from "@/app/(root)/lib/db";
import Post from "@/app/(root)/lib/models/Post";
import Order from "@/app/(root)/lib/models/Order";

export async function GET() {
  try {
    await mongoose.connect(connectionStr);

    const orders = await Order.find({}, "products");

    const productCount = {};

    orders.forEach((order) => {
      order.products.forEach((productId) => {
        const id = productId.toString();

        productCount[id] = (productCount[id] || 0) + 1;
      });
    });

    const sortedProducts = Object.entries(productCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const productIds = sortedProducts.map(
      ([id]) => new mongoose.Types.ObjectId(id)
    );

    const posts = await Post.find({
      _id: { $in: productIds },
    });

    const orderedPosts = productIds
      .map((id) =>
        posts.find((post) => post._id.toString() === id.toString())
      )
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      result: orderedPosts,
    });
  } catch (error) {
    console.error("Best seller error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
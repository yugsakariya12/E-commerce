import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Post from "@/app/(root)/lib/models/Post";
import { connectionStr } from "@/app/(root)/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    console.log("Product ID:", id);

    await mongoose.connect(connectionStr);

    const details = await Post.findById(id);

    return NextResponse.json({
      success: true,
      details,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectionStr } from "@/app/(root)/lib/db";
import Post from "@/app/(root)/lib/models/Post";

export async function GET() {
  try {
    await mongoose.connect(connectionStr);

    const data = await Post.find()
      .sort({ sells: -1 })
      .limit(10);

    return NextResponse.json({
      success: true,
      result: data,
    });
  } catch (error) {
    console.error("Error fetching best sellers:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
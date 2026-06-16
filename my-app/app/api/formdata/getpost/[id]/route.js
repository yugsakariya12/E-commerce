import { connectionStr } from "@/app/(root)/lib/db";
import mongoose from "mongoose";
import Post from "@/app/(root)/lib/models/Post";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(connectionStr);
  }

  const result = await Post.findById(id);

  return NextResponse.json({
    result,
    success: !!result,
  });
}

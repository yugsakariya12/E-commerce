
import Post from "@/app/(root)/lib/models/Post";
import mongoose from "mongoose";
import { connectionStr } from "@/app/(root)/lib/db";
import { NextResponse } from "next/server";



export async function GET(request) {
  
  await mongoose.connect(connectionStr);
  const data = await Post.find({});
  return NextResponse.json({ result: data });
}



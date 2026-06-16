import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectionStr } from "@/app/(root)/lib/db";
import Post from "@/app/(root)/lib/models/Post"; 



export async function GET() {
    await mongoose.connect(connectionStr, { useNewUrlParser: true });
    const data = await Post.find().sort({ createdAt: -1 }).limit(10);
    console.log(data);

    return NextResponse.json( {result: data })
}
 
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import Post from '@/app/(root)/lib/models/Post';
import { connectionStr } from '@/app/(root)/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { category, subCategory } = body;

    console.log("📥 Body:", body); // For debugging
    console.log("📌 Filter:", { category, subCategory });

    await mongoose.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const data = await Post.find({ category, subCategory });

    console.log("✅ Found posts:", data);

    return NextResponse.json({ result: data });
  } catch (error) {
    console.error("❌ Error in /api/catsubcat:", error);
    return NextResponse.json(
      { message: 'Something went wrong', error: error.message },
      { status: 500 }
    );
  }
}

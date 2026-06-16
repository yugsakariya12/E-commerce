import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import Post from '@/app/(root)/lib/models/Post';// your DB connection string helper

import { connectionStr } from '@/app/(root)/lib/db';



export async function PUT(req, { params }) {
  try {
    await mongoose.connect(connectionStr);
    const body = await req.json();
    const { incrementSell } = body;

    const updatedProduct = await Post.findByIdAndUpdate(
      params.id,
      { $inc: { sells: incrementSell || 1 } }, // default increment by 1
      { new: true }
    );

    return NextResponse.json({ success: true, updatedProduct });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
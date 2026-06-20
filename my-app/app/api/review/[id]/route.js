import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Post from '@/app/(root)/lib/models/Post';
import { connectionStr } from '@/app/(root)/lib/db';

export async function PUT(req, context) {
    const { id } = await context.params;
  

    console.log("ROUTE HIT");

 
  console.log("ID =", id);
  const { rating, message } = await req.json();

  await mongoose.connect(connectionStr, { useNewUrlParser: true });

  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
  }

  // Initialize if they don't exist
  if (!Array.isArray(post.review)) post.review = [];
  if (!Array.isArray(post.reviewMessage)) post.reviewMessage = [];

  post.review.unshift(rating);
  post.reviewMessage.unshift(message);

  const updatedPost = await post.save();

  return NextResponse.json({ success: true, updatedPost });
}

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectionStr } from '@/app/(root)/lib/db';
import Post from '@/app/(root)/lib/models/Post';

export async function GET() {
  await mongoose.connect(connectionStr);
  const data = await Post.find();
  return NextResponse.json({ result: data });
}

import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import Post from '@/app/(root)/lib/models/Post';// your DB connection string helper

import { connectionStr } from '@/app/(root)/lib/db';

export async function POST(request) {
  try {
    const { subCategory } = await request.json();

    await mongoose.connect(connectionStr, { useNewUrlParser: true });

    const filter = subCategory ? { subCategory } : {}; 

    const data = await Post.find(filter);

    return NextResponse.json({ result: data });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}

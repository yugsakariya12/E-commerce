import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import Post from '@/app/(root)/lib/models/Post';// your DB connection string helper

import { connectionStr } from '@/app/(root)/lib/db';

export async function GET(request) {
  try {
    

    await mongoose.connect(connectionStr, { useNewUrlParser: true });

   // fetch all if sells is empty

    const data = await Post.find().sort({sell: -1 }).limit(10);

    return NextResponse.json({ result: data });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}

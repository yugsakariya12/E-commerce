import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import Post from '@/app/(root)/lib/models/Post';
import { connectionStr } from '@/app/(root)/lib/db';


export async function POST(request) {
  try {
    const { category } = await request.json();

    if (!category) {
      return NextResponse.json({ message: 'Category is required' }, { status: 400 });
    }

    await mongoose.connect(connectionStr, { useNewUrlParser: true });

    const data = await Post.find({ category });

    return NextResponse.json({ result: data });
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', error: error.message },
      { status: 500 }
    );
  }
}

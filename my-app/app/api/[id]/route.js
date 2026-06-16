import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import Post from '@/app/(root)/lib/models/Post';
import { connectionStr } from '@/app/(root)/lib/db';




export async function GET(request,content){

    const id = content.params.id;
    console.log(id);

    await mongoose.connect(connectionStr,{useNewUrlParser:true})
    const details=await Post.findOne({_id:id})
    


    return NextResponse.json({success:true,details})

}
import { connectionStr } from "@/app/(root)/lib/db";
import { deliveryPartnersSchema } from "@/app/(root)/lib/models/Deleveryboy";
import mongoose from "mongoose";
import { NextResponse } from "next/server"

export async function GET(request,{params}){
    let city=params.city
    let success=false;
    await mongoose.connect(connectionStr,{useNewUrlParser:true});
    let filter ={city:{$regex:new RegExp(city,'i')}}
    const result = await deliveryPartnersSchema.find(filter)
   return NextResponse.json({result})
}
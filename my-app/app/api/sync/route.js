import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { connectionStr } from '@/app/(root)/lib/db';
import DeliveryPartner from '@/models/DeliveryPartner';

export async function POST(req) {
  try {
    await mongoose.connect(connectionStr, { useNewUrlParser: true });

    const { clerkId } = await req.json();

    if (!clerkId) {
      return NextResponse.json({ success: false, message: "clerkId is required" });
    }

    const partner = await DeliveryPartner.findOne({ clerkId });

    if (!partner) {
      return NextResponse.json({ success: false, message: "Partner not found" });
    }

    const result = partner.toObject();

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("Sync error:", err);
    return NextResponse.json({ success: false, message: "Something went wrong" });
  }
}
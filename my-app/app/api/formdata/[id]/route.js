import { connectionStr } from "@/app/(root)/lib/db";
import Post from "@/app/(root)/lib/models/Post";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";
import path from "path";
import { writeFile } from "fs/promises";

export async function DELETE(request, content) {
  const { id } = await content.params;

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(connectionStr);
  }

  const result = await Post.deleteOne({ _id: id });
  return NextResponse.json({ result, success: result.deletedCount > 0 });
}

export async function PUT(request, content) {
  const { id } = await content.params;
  const formData = await request.formData();

  const updatedData = {
    creatorId: formData.get("creatorId"),
    Description: formData.get("Description"),
    Name: formData.get("Name"),
    category: formData.get("category"),
    subCategory: formData.get("subCategory"),
    Price: formData.get("Price"),
    Size: formData.get("Size"),
  };

  const files = formData.getAll("postPhotos");
  let imageUrls = [];

  for (const file of files) {
    if (file && file.arrayBuffer) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = uuidv4() + path.extname(file.name);
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      await writeFile(filePath, buffer);
      imageUrls.push("/uploads/" + fileName);
    }
  }

  if (imageUrls.length > 0) {
    updatedData.postPhotos = imageUrls;
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(connectionStr);
  }

  const result = await Post.findByIdAndUpdate(id, updatedData, { new: true });

  return NextResponse.json({ result, success: !!result });
}

export async function GET(request, content) {
  const { id } = await content.params;

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(connectionStr);
  }

  const result = await Post.find({ adminid: id });
  return NextResponse.json({ result, success: !!result });
}

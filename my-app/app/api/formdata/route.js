import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectionStr } from "@/app/(root)/lib/db";
import Post from "@/app/(root)/lib/models/Post";

// FIX: Reusable DB connection — avoids reconnecting on every request
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(connectionStr);
};

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const name = formData.get("Name");
    const creatorId = formData.get("creatorId") || "admin";
    const description = formData.get("Description");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory");
    const profileimage = formData.get("profileImage") || "";
    const size = formData.getAll("Size");
    const Company = formData.get("company") || "";
    const Adminid = formData.get("adminid");

    // FIX: Validate price — reject NaN or negative values
    const rawPrice = formData.get("Price");
    const price = parseFloat(rawPrice);
    if (isNaN(price) || price < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid price value." },
        { status: 400 }
      );
    }

    // FIX: Validate required fields before touching the filesystem
    if (!name || !description || !category || !subCategory || !Adminid) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const files = formData.getAll("postPhotos");

    // FIX: Filter out non-File entries (formData.getAll can return strings)
    const validFiles = files.filter((f) => f instanceof File && f.size > 0);

    if (validFiles.length === 0 || validFiles.length > 4) {
      return NextResponse.json(
        { success: false, error: "You must upload between 1 and 4 photos." },
        { status: 400 }
      );
    }

    // FIX: Validate each file is actually an image
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    for (const file of validFiles) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" is not a supported image type.` },
          { status: 400 }
        );
      }
    }

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const imageUrls = [];

    for (const file of validFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // FIX: Sanitize filename — remove spaces and special characters to prevent path issues
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filename = `${Date.now()}-${safeName}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);
      imageUrls.push(`/uploads/${filename}`);
    }

    const newPost = new Post({
      creatorId,
      Name: name,
      Description: description,
      category,
      subCategory,
      Price: price,
      Size: size,
      postPhotos: imageUrls,
      sells: 0,
      company: Company,
      adminid: Adminid,
      profileImage: profileimage,
    });

    // FIX: Removed console.log of full data — avoid leaking sensitive info in production
    const saved = await newPost.save();

    return NextResponse.json({ success: true, post: saved }, { status: 201 });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const id = request.nextUrl.searchParams.get("id");

    // FIX: Validate id before querying — prevents empty/invalid DB query
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Admin ID is required." },
        { status: 400 }
      );
    }

    // FIX: Validate it's a valid MongoDB ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid admin ID format." },
        { status: 400 }
      );
    }

    const data = await Post.find({ adminid: id }).lean(); // FIX: .lean() for faster reads — returns plain JS objects

    return NextResponse.json({ success: true, result: data });

  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts." },
      { status: 500 }
    );
  }
}
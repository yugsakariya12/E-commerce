
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectionStr } from "@/app/(root)/lib/db";
import { AdminSchema } from "@/app/(root)/lib/models/Admin";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    await mongoose.connect(connectionStr);

    const contentType =
      request.headers.get("content-type");

    // ==========================
    // LOGIN
    // ==========================

    // ==========================
// LOGIN
// ==========================

if (contentType?.includes("application/json")) {
  const payload = await request.json();

  console.log("================================");
  console.log("LOGIN REQUEST RECEIVED");
  console.log("EMAIL:", payload.email);
  console.log("LOGIN FLAG:", payload.login);

  if (payload.login) {
    const admin = await AdminSchema.findOne({
      email: payload.email.trim().toLowerCase(),
    });

    console.log("ADMIN FOUND:", admin);

    if (!admin) {
      console.log("❌ ADMIN NOT FOUND");

      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    console.log("DB PASSWORD:", admin.password);

    const isMatch = await bcrypt.compare(
      payload.password,
      admin.password
    );

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      console.log("❌ PASSWORD MISMATCH");

      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    console.log("✅ LOGIN SUCCESS");

    const adminObj = admin.toObject();
    delete adminObj.password;

    return NextResponse.json(
      {
        success: true,
        result: adminObj,
      },
      { status: 200 }
    );
  }
}

    // ==========================
    // SIGNUP
    // ==========================

    if (
      contentType?.includes(
        "multipart/form-data"
      )
    ) {
      const formData =
        await request.formData();

      const adminData = {
        name:
          formData.get("name")?.trim(),
        email: formData
          .get("email")
          ?.trim()
          .toLowerCase(),
        password:
          formData.get("password"),
        city:
          formData.get("city")?.trim(),
        address:
          formData
            .get("address")
            ?.trim(),
        contact:
          formData
            .get("contact")
            ?.trim(),
        company:
          formData
            .get("company")
            ?.trim(),
      };

      // ==========================
      // REQUIRED FIELDS CHECK
      // ==========================

      const requiredFields = [
        "name",
        "email",
        "password",
        "city",
        "address",
        "contact",
        "company",
      ];

      for (const field of requiredFields) {
        if (!adminData[field]) {
          return NextResponse.json(
            {
              success: false,
              message: `${field} is required`,
            },
            { status: 400 }
          );
        }
      }

      // ==========================
      // EMAIL EXISTS CHECK
      // ==========================

      const existingAdmin =
        await AdminSchema.findOne({
          email: adminData.email,
        });

      if (existingAdmin) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Email already exists",
          },
          { status: 409 }
        );
      }

      // ==========================
      // CONTACT VALIDATION
      // ==========================

      if (
        !/^[0-9]{10}$/.test(
          adminData.contact
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Contact number must be 10 digits",
          },
          { status: 400 }
        );
      }

      // ==========================
      // IMAGE UPLOAD
      // ==========================

      const image =
        formData.get("profileImage");

      if (image && image.name) {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
        ];

        if (
          !allowedTypes.includes(
            image.type
          )
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Only JPG, PNG and WEBP images are allowed",
            },
            { status: 400 }
          );
        }

        const bytes =
          await image.arrayBuffer();

        const buffer =
          Buffer.from(bytes);

        const uploadDir =
          path.join(
            process.cwd(),
            "public/uploads/admins"
          );

        if (
          !fs.existsSync(uploadDir)
        ) {
          fs.mkdirSync(uploadDir, {
            recursive: true,
          });
        }

        const filePath = `/uploads/admins/${Date.now()}-${
          image.name
        }`;

        fs.writeFileSync(
          `public${filePath}`,
          buffer
        );

        adminData.profileImage =
          filePath;
      }

      // ==========================
      // HASH PASSWORD
      // ==========================

      adminData.password =
        await bcrypt.hash(
          adminData.password,
          10
        );

      const admin =
        new AdminSchema(adminData);

      const result =
        await admin.save();

      const adminObj =
        result.toObject();

      delete adminObj.password;

      return NextResponse.json(
        {
          success: true,
          message:
            "Admin created successfully",
          result: adminObj,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Unsupported content type",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error(
      "Admin API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

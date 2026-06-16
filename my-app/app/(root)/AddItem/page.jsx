"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/app/components/Loader";

import {
  AddPhotoAlternateOutlined,
  CategoryOutlined,
  SubjectOutlined,
  ViewListOutlined,
  ListAltOutlined,
  CurrencyRupee,
  CheckroomOutlined,
  Inventory2Outlined,
} from "@mui/icons-material";

const Posting = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "Men",
      subCategory: "Topwear",
      Size: [],
    },
  });

  const router = useRouter();
  const [previewFiles, setPreviewFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = [...previewFiles, ...selectedFiles];

    // Deduplicate by name + size
    const fileMap = new Map();
    for (const file of newFiles) {
      const key = `${file.name}-${file.size}`;
      if (!fileMap.has(key)) fileMap.set(key, file);
    }

    const finalFiles = Array.from(fileMap.values()).slice(0, 4);
    setPreviewFiles(finalFiles);
    setValue("postPhotos", finalFiles, { shouldValidate: true });

    // FIX: Clear image error as soon as at least 1 image is selected
    if (finalFiles.length > 0) {
      clearErrors("postPhotos");
    }

    // Reset input so same file can be re-selected
    e.target.value = null;
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = [...previewFiles];
    updatedFiles.splice(index, 1);
    setPreviewFiles(updatedFiles);
    setValue("postPhotos", updatedFiles, { shouldValidate: true });

    // FIX: Show error again if all images removed
    if (updatedFiles.length === 0) {
      setError("postPhotos", { type: "manual", message: "Please upload at least 1 photo" });
    }
  };

  const handlePublish = async (data) => {
    // FIX: Block submit if no images selected
    if (!previewFiles.length) {
      setError("postPhotos", { type: "manual", message: "Please upload at least 1 photo" });
      return;
    }

    // FIX: Safely read Admin from localStorage with try/catch
    let adminData = null;
    try {
      adminData = JSON.parse(localStorage.getItem("Admin"));
    } catch {
      console.error("Failed to parse Admin from localStorage");
    }

    if (!adminData?._id) {
      console.error("Admin not found in localStorage");
      return;
    }

    setIsSubmitting(true);
    try {
      const postForm = new FormData();
      postForm.append("creatorId", data.creatorId || "admin");
      postForm.append("Description", data.Description);
      postForm.append("Name", data.Name);
      postForm.append("category", data.category);
      postForm.append("subCategory", data.subCategory);
      postForm.append("Price", data.Price);
      postForm.append("adminid", adminData._id);
      postForm.append("company", adminData.company || "");
      postForm.append("profileImage", adminData.profileImage || "");

      if (Array.isArray(data.Size)) {
        data.Size.forEach((size) => postForm.append("Size", size));
      }

      previewFiles.forEach((file) => {
        postForm.append("postPhotos", file);
      });

      const res = await fetch("/api/formdata", {
        method: "POST",
        body: postForm,
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        // FIX: Handle non-ok responses gracefully
        const errData = await res.json().catch(() => ({}));
        console.error("Server error:", errData);
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5e3c3] py-6 px-4">
      {isSubmitting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(245, 227, 195, 0.80)", backdropFilter: "blur(6px)" }}
        >
          <div className="bg-white border border-[#e2b084] rounded-2xl shadow-lg px-10 py-8 flex flex-col items-center gap-3">
            <Loader />
            <p className="text-[#7a3e3e] font-semibold text-sm tracking-wide animate-pulse">
              Adding your item...
            </p>
          </div>
        </div>
      )}

      <div className="absolute top-5 left-6">
        <Image src="/logobg.png" alt="Logo" width={60} height={60} className="rounded-full" />
      </div>

      <h2 className="text-3xl font-bold text-center text-[#7a3e3e] mb-6 flex justify-center items-center gap-2">
        <Inventory2Outlined fontSize="medium" />
        Add New Item
      </h2>

      <form
        onSubmit={handleSubmit(handlePublish)}
        className="flex flex-col gap-6 max-w-lg mx-auto px-6 py-10 bg-white border border-[#e2b084] shadow-md rounded-lg"
      >
        {/* Photo Upload */}
        <div>
          <label className="flex items-center gap-2 text-[#7a3e3e] font-medium mb-2">
            <AddPhotoAlternateOutlined fontSize="small" />
            Upload Photos{" "}
            <span className="text-[#c96e38] text-xs font-normal">
              (min 1, max 4)
            </span>
          </label>

          {/* FIX: Only show upload input if fewer than 4 images selected */}
          {previewFiles.length < 4 && (
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-[#7a3e3e] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-[#fbe3cb] file:text-[#7a3e3e] hover:file:bg-[#f1caaa]"
            />
          )}

          {/* FIX: Show validation error clearly below the upload input */}
          {errors.postPhotos && (
            <p className="text-red-500 text-sm mt-1">{errors.postPhotos.message}</p>
          )}

          {previewFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {previewFiles.map((file, idx) => (
                <div key={idx} className="flex flex-col items-center relative">
                  <div className="relative w-[100px] h-[100px] border border-[#d9b38c] rounded overflow-hidden">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-[-6px] right-[-6px] bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600 transition"
                    aria-label={`Remove image ${idx + 1}`}
                  >
                    ×
                  </button>
                  <p className="text-xs text-[#7a3e3e] mt-1 truncate w-[100px] text-center">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Helper count text */}
          {previewFiles.length > 0 && (
            <p className="text-xs text-[#8a5d3b] mt-2">
              {previewFiles.length}/4 photo{previewFiles.length > 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="flex items-center gap-2 text-[#7a3e3e] font-medium mb-1">
            <CategoryOutlined fontSize="small" /> Name
          </label>
          <input
            {...register("Name", { required: "Name is required" })}
            type="text"
            placeholder="e.g. Silk Kurta"
            className="w-full px-4 py-2 border border-[#d9b38c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c96e38]"
          />
          {errors.Name && <p className="text-red-500 text-sm mt-1">{errors.Name.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-[#7a3e3e] font-medium mb-1">
            <SubjectOutlined fontSize="small" /> Description
          </label>
          <textarea
            {...register("Description", {
              required: "Description is required",
              validate: (val) =>
                val.trim().length < 3 ? "Description must be more than 2 characters" : true,
            })}
            rows={3}
            placeholder="Describe the item..."
            className="w-full px-4 py-2 border border-[#d9b38c] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#c96e38]"
          />
          {errors.Description && (
            <p className="text-red-500 text-sm mt-1">{errors.Description.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="flex items-center gap-2 text-[#7a3e3e] font-medium mb-1">
            <ViewListOutlined fontSize="small" /> Category
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full px-4 py-2 border border-[#d9b38c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c96e38]"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Children">Children</option>
          </select>
        </div>

        {/* Sub Category */}
        <div>
          <label className="flex items-center gap-2 text-[#7a3e3e] font-medium mb-1">
            <ListAltOutlined fontSize="small" /> Sub Category
          </label>
          <select
            {...register("subCategory", { required: "Sub-category is required" })}
            className="w-full px-4 py-2 border border-[#d9b38c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c96e38]"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Casualwear">Casualwear</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="flex items-center gap-2 text-[#7a3e3e] font-medium mb-1">
            <CurrencyRupee fontSize="small" /> Price
          </label>
          <input
            {...register("Price", {
              required: "Price is required",
              pattern: {
                value: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: "Enter a valid price (e.g. 499 or 499.99)",
              },
            })}
            type="text"
            placeholder="e.g. 499"
            className="w-full px-4 py-2 border border-[#d9b38c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c96e38]"
          />
          {/* FIX: Added missing price error display */}
          {errors.Price && <p className="text-red-500 text-sm mt-1">{errors.Price.message}</p>}
        </div>

        {/* Size */}
        <div>
          <label className="flex items-center gap-2 text-[#7a3e3e] font-medium mb-2">
            <CheckroomOutlined fontSize="small" /> Size
          </label>
          <div className="flex gap-4 flex-wrap">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <label key={size} className="flex items-center gap-2 text-[#7a3e3e] cursor-pointer">
                <input
                  type="checkbox"
                  value={size}
                  onChange={(e) => {
                    const values = new Set(watch("Size") || []);
                    if (e.target.checked) {
                      values.add(size);
                    } else {
                      values.delete(size);
                    }
                    setValue("Size", Array.from(values), { shouldValidate: true });
                  }}
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-[300px] py-3 mt-6 bg-[#c96e38] text-white font-semibold rounded-md hover:bg-[#b3591e] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding Item..." : "Add Item"}
          </button>
          <Link href="/admin/dashboard" className="w-full sm:w-[300px]">
            <button
              type="button"
              disabled={isSubmitting}
              className="w-full py-3 mt-6 bg-[#7a3e3e] text-white font-semibold rounded-md hover:bg-[#5e2d2d] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Back To Dashboard
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Posting;
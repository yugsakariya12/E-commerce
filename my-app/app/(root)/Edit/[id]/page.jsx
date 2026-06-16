"use client";

import { useEffect, useState } from "react";
import { AddPhotoAlternateOutlined, CurrencyRupee } from "@mui/icons-material";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";


const Posting = () => {
  const {reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "Men",
      subCategory: "Topwear",
    },
  });

  const router = useRouter();
  const { id } = useParams();

  const [previewFiles, setPreviewFiles] = useState([]);
  const [initialPhotos, setInitialPhotos] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setPreviewFiles(files);
    setValue("postPhotos", files);
  };

 const handleLoadPost = async () => {
  try {
    const response = await fetch(`/api/formdata/getpost/${id}`);
    const data = await response.json();

    if (data.success) {
      const result = data.result;

      reset({
        Name: result.Name,
        Description: result.Description,
        category: result.category,
        subCategory: result.subCategory,
        Price: result.Price,
        Size: result.Size,
        creatorId: result.creatorId,
      });

      setInitialPhotos(result.postPhotos || []);
    }
  } catch (err) {
    console.error("Failed to load post:", err);
  }
};


  useEffect(() => {
    if (id) handleLoadPost();
  }, [id]);

  const handlePublish = async (data) => {
    try {
      const postForm = new FormData();
      postForm.append("creatorId", data.creatorId || "admin");
      postForm.append("Description", data.Description);
      postForm.append("Name", data.Name);
      postForm.append("category", data.category);
      postForm.append("subCategory", data.subCategory);
      postForm.append("Price", data.Price);
      postForm.append("Size", data.Size);

      if (data.postPhotos?.length) {
        data.postPhotos.forEach((file) => {
          postForm.append("postPhotos", file);
        });
      }

      const res = await fetch("/api/formdata/" + id, {
        method: "PUT",
        body: postForm,
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const error = await res.text();
        console.error("Update failed:", error);
      }
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handlePublish)}
      className="flex flex-col gap-6 max-w-2xl mx-auto px-6 py-10 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Edit Item</h2>

      {/* Photo Upload */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Upload up to 4 Photos
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0 file:text-sm file:font-semibold
            file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />

        {initialPhotos.length > 0 && previewFiles.length === 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {initialPhotos.map((url, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="relative w-[100px] h-[100px] border border-gray-300 rounded overflow-hidden">
                  <Image src={url} alt={`photo-${idx}`} layout="fill" objectFit="cover" />
                </div>
              </div>
            ))}
          </div>
        )}

        {previewFiles.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {previewFiles.map((file, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="relative w-[100px] h-[100px] border border-gray-300 rounded overflow-hidden">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`preview-${idx}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate w-[100px] text-center">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        )}
        {errors.postPhotos && (
          <p className="text-red-500 text-sm mt-1">{errors.postPhotos.message}</p>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Name</label>
        <input
          {...register("Name", { required: "Name is required" })}
          type="text"
          placeholder="Enter item name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.Name && <p className="text-red-500 text-sm mt-1">{errors.Name.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Description</label>
        <textarea
          {...register("Description", {
            required: "Description is required",
            validate: (val) =>
              val.length < 3 ? "Description must be more than 2 characters" : true,
          })}
          rows={3}
          placeholder="What's on your mind?"
          className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.Description && (
          <p className="text-red-500 text-sm mt-1">{errors.Description.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Category</label>
        <select
          {...register("category", { required: "Category is required" })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Children">Children</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Sub Category */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Sub Category</label>
        <select
          {...register("subCategory", { required: "Sub-category is required" })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="Topwear">Topwear</option>
          <option value="Bottomwear">Bottomwear</option>
          <option value="Casualwear">Casualwear</option>
        </select>
        {errors.subCategory && (
          <p className="text-red-500 text-sm mt-1">{errors.subCategory.message}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-gray-700 font-medium mb-1 flex items-center gap-1">
          Price <CurrencyRupee fontSize="small" />
        </label>
        <input
          {...register("Price", { required: "Price is required" })}
          type="text"
          placeholder="Enter price"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.Price && (
          <p className="text-red-500 text-sm mt-1">{errors.Price.message}</p>
        )}
      </div>

      {/* Size */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Size</label>
        <div className="flex gap-4 flex-wrap">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <label key={size} className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                value={size}
                {...register("Size", { required: "Size is required" })}
              />
              <span>{size}</span>
            </label>
          ))}
        </div>
        {errors.Size && <p className="text-red-500 text-sm mt-1">{errors.Size.message}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex flex-row gap-4 justify-center">
        <button
          type="submit"
          className="w-[300px] py-3 mt-6 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
        >
          Update Item
        </button>
        <Link href='/admin/dashboard'>
          <button className="w-[300px] py-3 mt-6 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition">
            Back To List
          </button>
        </Link>
      </div>
    </form>
  );
};

export default Posting;

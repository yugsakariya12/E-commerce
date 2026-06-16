"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "./Loader";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import "@fontsource/poppins";
import { motion } from "framer-motion";

const Card = ({ post , update}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await fetch("/api/formdata/" + id, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Item deleted");
update()
        router.refresh();
      } else {
        toast.error("Failed to delete item");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push("/Edit/" + post._id);
  };

  return (
    <>
      <Toaster position="top-right" />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#fff4e6] border border-[#e5c7a4] rounded-lg shadow p-4 flex flex-col sm:flex-row items-center justify-between gap-2 mb-4"
      >
        
        <div className="flex items-center gap-5 flex-grow">
          <div className="relative w-[100px] h-[100px] min-w-[100px] overflow-hidden rounded-md border border-[#ddb892]">
            <Image
              src={post.postPhotos?.[0] || "/placeholder.jpg"}
              alt="Product"
              fill
              className="object-cover"
            />
          </div>

         <div className="flex flex-col gap-1 text-sm sm:text-base">
            
       <div className="flex items-center gap-2">
  <div className="relative w-[32px] h-[32px] rounded-full overflow-hidden border border-[#c96e38]">
    <Image
      src={post?.profileImage || "/avatar-placeholder.png"}
      alt="Admin Profile"
      fill
      className="object-cover"
    />
  </div>

  <span className="text-[#5a2929] font-semibold text-[14px]">
    {post?.company}
  </span>
</div>

  
  <p className="text-[#7a3e3e] font-bold text-[15px]">
    {post.Name}
  </p>


  <p className="text-[#5c3a36] font-medium text-[14px]">
    {post.Description}
  </p>


  <p className="font-semibold text-[#c96e38] text-[14px]">
    ₹{post.Price} | {post.category} / {post.subCategory}
  </p>
</div>

        </div>

        
        <div className="flex gap-2 items-center shrink-0">
          <button
            onClick={handleEdit}
            className="text-[#7a3e3e] hover:text-white hover:bg-[#c96e38] p-[12px] rounded-md transition duration-200"
          >
            <FaEdit className="text-2xl" />
          </button>
          <button
            onClick={() => handleDelete(post._id)}
            className="text-red-600 hover:text-white hover:bg-red-500 p-[12px] rounded-md transition duration-200"
          >
            <FaTrashAlt className="text-2xl" />
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Card;

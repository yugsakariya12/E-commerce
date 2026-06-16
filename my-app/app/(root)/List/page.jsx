"use client";

import { useEffect, useState } from "react";
import Loader from "@/app/components/Loader";
import Card from "@/app/components/card";
import Image from "next/image";
import Link from "next/link";
import "@fontsource/poppins";
import { FaBoxOpen, FaArrowLeft } from "react-icons/fa";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [feedPost, setFeedPost] = useState([]);

 const getFeedPost = async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem("Admin"));
    if (!adminData || !adminData._id) {
      console.error("Admin not found in localStorage");
      setFeedPost([]);
      setLoading(false);
      return;
    }

    const id1 = adminData._id;

    const response = await fetch(`/api/formdata?id=${id1}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setFeedPost(data.result || []);
  } catch (err) {
    console.error("Failed to fetch posts", err);
    setFeedPost([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    getFeedPost();
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf6f0] py-2 px-4 font-[Poppins] flex flex-col justify-between fixed w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        {/* Title with Icon */}
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-[#7a3e3e] flex items-center gap-2">
            Your Items <FaBoxOpen className="text-[#c96e38] text-2xl" />
          </h1>
        </div>

        {/* Logo on Right */}
        <div>
          <Image
            src="/logobg.png"
            alt="Logo"
            width={55}
            height={55}
            className="rounded-full shadow"
          />
        </div>
      </div>

      {/* Loader or Cards */}
      {loading ? (
  <div className="flex justify-center py-20">
    <Loader />
  </div>
) : (
  <div className="flex flex-col gap-8 overflow-y-auto max-h-[70vh] pr-2">
    {feedPost.length>0?feedPost.map((post) => (
      <Card key={post._id} post={post} update={getFeedPost} />
    )):<div className="text-center text-[#7a3e3e] text-lg ">No Item Listed</div>}
  </div>
)}


      {/* Back Button */}
      <div className="mt-3 flex justify-center">
        <Link href="/admin/dashboard">
          <button className="flex items-center gap-2 bg-[#c96e38] text-white px-6 py-3 rounded-md shadow hover:bg-[#b3591e] transition duration-300">
            <FaArrowLeft className="text-white" />
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

"use client";

import React, { useEffect, useState } from "react";
import CollectionCard from "./CollectionCard";
import { WorkspacePremium } from "@mui/icons-material";

const BestSeller = () => {
  const [feedPost, setFeedPost] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFeedPost = async () => {
    try {
      const response = await fetch("/api/formdata/bestsell", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setFeedPost(data.result);
    } catch (error) {
      console.error("Failed to fetch best seller items", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeedPost();
  }, []);

  return (
    <div className="py-12 px-6 bg-[#fffaf4]">

      {/* Header aligned left */}
      <div className="flex items-center gap-2 mb-8">
        <WorkspacePremium className="text-[#c96e38]" />
        <h2 className="text-4xl font-[Cormorant_Garamond] font-bold text-[#7a3e3e] tracking-wide drop-shadow-sm italic">
          Best Sellers
        </h2>
      </div>

      {/* Cards start from left, wrap naturally */}
      <div className="flex flex-wrap justify-start gap-6">
        {loading ? (
          <div className="text-[#7a3e3e] text-lg font-semibold animate-pulse">
            Loading Best Sellers...
          </div>
        ) : (
          feedPost.map((post) => (
            <CollectionCard key={post._id} post={post} bestSeller />
          ))
        )}
      </div>
    </div>
  );
};

export default BestSeller;
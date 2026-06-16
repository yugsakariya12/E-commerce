"use client";

import React, { useEffect, useState } from "react";
import CollectionCard from "./CollectionCard";
import { GiClothes } from "react-icons/gi";

const NewCollection = () => {
  const [feedPost, setFeedPost] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFeedPost = async () => {
    try {
      const response = await fetch("/api/formdata/newcoll");
      const data = await response.json();
      setFeedPost(data.result);
    } catch (error) {
      console.error("Error fetching new collection:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeedPost();
  }, []);

  return (
    <div className="py-10 px-6 bg-[#fffaf4] min-h-[300px]">

      {/* Header aligned left */}
      <div className="flex items-center gap-2 mb-8">
        <GiClothes className="text-[#c96e38] text-3xl" />
        <h2 className="text-3xl font-bold font-[Cormorant_Garamond] text-[#7a3e3e] italic tracking-wide">
          New Collection
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-start items-center h-40">
          <p className="text-[#7a3e3e] text-lg font-medium animate-pulse">
            Loading New Collection...
          </p>
        </div>
      ) : (
        /* Cards start from left, wrap naturally */
        <div className="flex flex-wrap justify-start gap-6">
          {feedPost.map((post) => (
            <CollectionCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewCollection;
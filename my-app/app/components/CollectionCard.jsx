import { CurrencyRupee, LocalFireDepartment } from "@mui/icons-material";
import Image from "next/image";
import React, { useState } from "react";
import "@fontsource/playfair-display";
import "@fontsource/cormorant-garamond";
import "@fontsource/poppins";
import Link from "next/link";

const CollectionCard = ({ post, bestSeller = false }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link href={`/differ/${post._id}`} className="block">
      <div className="relative w-52 max-w-sm rounded-xl overflow-hidden shadow-lg bg-[#fffaf4] border border-[#f0e1d1] transition-transform duration-300 hover:scale-105 flex flex-col h-full">

     
        {bestSeller && (
          <div className="absolute top-2 left-2 bg-[#c96e38] text-white text-[10px] px-2 py-[2px] rounded-full font-semibold z-10 flex items-center gap-1 shadow-sm">
            <LocalFireDepartment style={{ fontSize: "14px" }} />
            Best Seller
          </div>
        )}

        
        <div className="w-full aspect-[4/3] bg-white flex items-center justify-center relative overflow-hidden">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#fbe3cb] animate-pulse">
              <div className="w-8 h-8 rounded-full border-4 border-dashed border-[#c96e38] animate-spin" />
            </div>
          )}
          {post?.postPhotos?.length > 0 && (
            <Image
              src={post.postPhotos[0]}
              alt={post.Name}
              fill
              onLoad={() => setImgLoaded(true)}
              className={`object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
        </div>

       
        <div className="px-3 pt-3 pb-4 bg-[#fbe3cb] rounded-b-xl transition-all duration-300 flex flex-col justify-between flex-grow">
         <div className="flex items-center gap-2">
  <div className="relative w-[32px] h-[32px] rounded-full overflow-hidden border border-[#c96e38]">
    <Image
      src={post?.profileImage || "/avatar-placeholder.png"}
      alt="Admin Profile"
      fill
      className="object-cover"
    />
  </div>

  <span className="text-[#5a2929] font-semibold text-[18px]">
    {post?.company}
  </span>
</div>

          <p className="text-left text-[14px] font-[Playfair_Display] text-[#7a3e3e] tracking-wide font-bold capitalize truncate">
            {post.Name}
          </p>

         
          <p className="text-left text-[12px] font-[Poppins] text-[#8a5d3b] leading-tight font-semibold line-clamp-2">
            {post.Description || "No description available."}
          </p>

          
          <div className="w-full border-b border-[#d4a276] my-2" />

          
          <p className="text-left text-[16px] text-[#c96e38] font-[Poppins] font-semibold flex items-center gap-1 pt-1">
            <CurrencyRupee fontSize="small" />
            {post.Price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;

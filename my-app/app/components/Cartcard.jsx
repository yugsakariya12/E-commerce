"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Delete } from "@mui/icons-material";

const Cartcard = ({ item,onRemove }) => {
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = () => {
    const existingItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    const updatedItems = existingItems.filter(
      (i) => !(i._id === item._id && i.size === item.size)
    );

    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    setIsDeleted(true); 
  };

  if (isDeleted) return null; 

  return (
    <div className="flex justify-between items-center border p-3 rounded-lg mb-4">
      <Image
        src={item.photo}
        alt="product photo"
        width={70}
        height={70}
        className="rounded-lg"
      />

      <div className="flex flex-col gap-1 ml-4">
        <p className="text-sm text-gray-600"></p>
        <p className="font-semibold text-black">
        {item.name} -  ₹{item.price} 
        </p>
        <p>Quentity:{item.quantity
}</p>
        <p className="bg-amber-400 px-2 py-0.5 rounded text-sm w-fit">
          Size: {item.size}
        </p>
      </div>

      <div
        onClick={() => onRemove(item._id, item.size)}
        className="cursor-pointer ml-4"
        title="Remove from cart"
      >
        <Delete className="text-red-500" />
      </div>

      
    </div>
  );
};

export default Cartcard;

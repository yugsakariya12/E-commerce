'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { FaBox, FaMoneyBillWave, FaMapMarkerAlt, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import Loader from "@/app/components/Loader";

const Page = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders();
  }, []);

  const getMyOrders = async () => {
    try {
      let id=JSON.parse(localStorage.getItem("Admin"))._id;
      const res = await fetch("/api/order/allorder/"+id,{
method:"GET",
  headers: {
        "Content-Type": "application/json",
      },



      });

      const data = await res.json();
      if (data.success) {
        setMyOrders(data.result);
        toast.success("Orders fetched successfully!");
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6f0] px-6 py-10 font-[Poppins] relative">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-bold text-[#7a3e3e] flex items-center gap-3">
          <FaBox className="text-[#c96e38] text-xl" /> Your Orders
        </h2>
        <Image
          src="/logobg.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full shadow"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      ) : myOrders.length === 0 ? (
        <p className="text-center text-[#7a3e3e] text-lg">No data available</p>
      ) : (
        <div className="grid gap-6">
          {myOrders.map((item, index) => (
            <div
              key={index}
              className="bg-[#fff4e6] border border-[#e5c7a4] p-5 rounded-lg shadow flex flex-col gap-2"
            >
               {item.image && (
    <Image
      src={item.image}
      alt={item.productName || "Product Image"}
      width={100}
      height={100}
      className="rounded-md object-cover border"
    />
  )} 
              <h4 className="text-lg font-semibold text-[#7a3e3e] flex items-center gap-2">
                <FaBox className="text-[#c96e38]" /> Name: {item.firstName} {item.lastName}
              </h4>
             
              <div className="text-[#5c3a36] flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#c96e38]" /> Address: {item.street}, {item.city}, {item.state} - {item.pincode}
              </div>
              <div className="text-[#5c3a36] flex items-center gap-2">
                <FaCheckCircle className="text-[#c96e38]" /> Status: {item.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back Button */}
      <div className="mt-12 flex justify-center">
        <Link href="/admin/dashboard">
          <div className="flex items-center gap-2 px-6 py-3 bg-[#c96e38] text-white rounded-md shadow hover:bg-[#b3591e] transition">
            <FaArrowLeft /> <span>Back to Dashboard</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Page;

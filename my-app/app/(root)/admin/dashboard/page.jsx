"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaPlus, FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import Loader from "@/app/components/Loader";

const AdminDashboard = () => {
  const router = useRouter();
  const [myOrders, setMyOrders] = useState([]);
  const [feedPost, setFeedPost] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const adminData = JSON.parse(localStorage.getItem("Admin"));
        if (!adminData?._id) throw new Error("Admin not found");

        const id1 = adminData._id;

        const [ordersRes, feedRes] = await Promise.all([
          fetch(`/api/order/allorder/${id1}`, { method: "GET" }),
          fetch(`/api/formdata/${id1}`, { method: "GET" }),
        ]);

        const ordersData = await ordersRes.json();
        const feedData = await feedRes.json();

        setFeedPost(feedData.result || []);
        if (ordersData.success) setMyOrders(ordersData.result || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setMyOrders([]);
        setFeedPost([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Admin");
    localStorage.removeItem("User");
    localStorage.removeItem("delivery");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#f5e3c3]">
      <nav className="bg-[#c96e38] shadow-md px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <img
            src="/logobg.png"
            alt="VZ Logo"
            className="w-13 h-13 rounded-full shadow-sm"
          />
          <span className="text-[30px] font-semibold italic tracking-wide text-[#fbe3cb] font-[Cormorant_Garamond] drop-shadow-sm">
            VIBE ZONE
          </span>
        </div>

        <div className="flex gap-3 flex-wrap justify-center items-center">
          <Link href="/AddItem">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#fbe3cb] text-[#7a3e3e] rounded-lg shadow hover:bg-[#f1d1a4] transition font-semibold cursor-pointer">
              <FaPlus className="text-[#c96e38]" />
              <span>Add Items</span>
            </div>
          </Link>
          <Link href="/List">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#fbe3cb] text-[#7a3e3e] rounded-lg shadow hover:bg-[#f1d1a4] transition font-semibold cursor-pointer">
              <FaClipboardList className="text-[#c96e38]" />
              <span>List Items</span>
            </div>
          </Link>
          <Link href="/admin/vieworder">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#fbe3cb] text-[#7a3e3e] rounded-lg shadow hover:bg-[#f1d1a4] transition font-semibold cursor-pointer">
              <FaClipboardList className="text-[#c96e38]" />
              <span>View Orders</span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[#7a3e3e] text-[#fbe3cb] rounded-lg shadow hover:bg-[#5a2e2e] transition font-semibold cursor-pointer"
          >
            <FaSignOutAlt className="text-[#fbe3cb]" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center p-10">
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <div className="bg-[#fbe3cb] border border-[#e2b084] rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold text-[#7a3e3e] mb-2">
                No. of Products
              </h3>
              <div className="bg-[#c96e38] text-white text-lg font-bold h-10 w-10 rounded-full flex items-center justify-center shadow">
                {feedPost?.length || 0}
              </div>
            </div>
            <div className="bg-[#fbe3cb] border border-[#e2b084] rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold text-[#7a3e3e] mb-2">
                No. of Orders
              </h3>
              <div className="bg-[#c96e38] text-white text-lg font-bold h-10 w-10 rounded-full flex items-center justify-center shadow">
                {myOrders.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
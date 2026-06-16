'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaRupeeSign, FaClipboardList, FaArrowLeft, FaBoxOpen } from "react-icons/fa";
import Image from "next/image";
import Loader from "@/app/components/Loader";

const Page = () => {
  const router = useRouter();
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delivery = JSON.parse(localStorage.getItem('delivery'));
    if (!delivery) {
      router.push('/deleverypartner');
    } else {
      getMyOrders(delivery._id);
    }
  }, []);

  const getMyOrders = async (id) => {
    try {
      setLoading(true);
      const res = await fetch('/api/deleverypartners/order/' + id);
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setMyOrders(data.result);
      }
    } catch (error) {
      setLoading(false);
      console.error("❌ Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch('/api/deleverypartners/update-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });

      const result = await res.json();

      if (result.success) {
        setMyOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6f0] text-[#3c2a21] px-6 py-8 font-[Poppins] relative">
      {loading && (
        <div className="fixed inset-0 bg-[#fdf6f0]/60 z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

  
      <div className="absolute top-1 left-2 z-10">
        <Image
          src="/logobg.png"
          alt="VZ Logo"
          width={70}
          height={70}
          className="rounded-full shadow-md"
        />
      </div>

   
      <div className="absolute top-6 right-6 text-3xl text-[#c96e38]">
       
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#7a3e3e] mb-8 flex items-center justify-center gap-3">
          < FaBoxOpen className="text-[#c96e38]" /> Your Orders
        </h1>

        <div className="flex flex-col gap-6">
          {myOrders.map((item, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-md shadow-md rounded-xl p-6 border border-[#e2b084]"
            >
              <p className="text-gray-800 font-medium mb-1 flex items-center gap-2">
                <FaUser className="text-[#c96e38]" /> Customer: {item.firstName} {item.lastName}
              </p>
              <p className="text-gray-800 mb-1 flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#c96e38]" /> {item.street}, {item.city}, {item.state} - {item.pincode}
              </p>
              <p className="text-gray-800 mb-1 flex items-center gap-2">
                <FaPhone className="text-[#c96e38]" /> {item.phone || 'N/A'}
              </p>
              <p className="text-gray-800 mb-1 flex items-center gap-2">
                <FaEnvelope className="text-[#c96e38]" /> {item.email || 'N/A'}
              </p>
              <p className="text-gray-800 mb-3 flex items-center gap-2">
                <FaRupeeSign className="text-[#c96e38]" /> Amount: ₹{item.totalAmount}
              </p>

              <div className="text-gray-800 mb-2 flex items-center gap-3">
                <strong>Status:</strong>
                <select
                  id={`status-${index}`}
                  className="px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c96e38] text-sm"
                  value={item.status}
                  onChange={(e) => updateOrderStatus(item._id, e.target.value)}
                >
                  <option value="Confirm">Confirmed</option>
                  <option value="On the way">On the way</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed to delivery">Failed to delivery</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => router.push("/deleverydashboard")}
            className="flex items-center gap-2 px-6 py-3 bg-[#c96e38] text-white rounded-md shadow hover:bg-[#b3591e] transition"
          >
            <FaArrowLeft /> <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;

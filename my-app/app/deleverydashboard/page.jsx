"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
FaUser,
FaPhone,
FaEnvelope,
FaMapMarkerAlt,
FaRupeeSign,
FaArrowLeft,
FaBoxOpen,
FaSignOutAlt,
} from "react-icons/fa";
import Image from "next/image";
import Loader from "@/app/components/Loader";

const Page = () => {
const router = useRouter();
const [myOrders, setMyOrders] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const deliveryData = localStorage.getItem("delivery");

if (!deliveryData) {
  router.push("/deleverypartner");
  return;
}

try {
  const deliveryPartner = JSON.parse(deliveryData);

  if (!deliveryPartner?._id) {
    localStorage.removeItem("delivery");
    router.push("/deleverypartner");
    return;
  }

  getMyOrders(deliveryPartner._id);
} catch (error) {
  console.error("Invalid localStorage data:", error);
  localStorage.removeItem("delivery");
  router.push("/deleverypartner");
}


}, []);

const getMyOrders = async (id) => {
try {
const res = await fetch(`/api/deleverypartners/order/${id}`);
const data = await res.json();


  if (data.success) {
    setMyOrders(data.result);
  }
} catch (error) {
  console.error("Error fetching orders:", error);
} finally {
  setLoading(false);
}


};

const updateOrderStatus = async (orderId, newStatus) => {
try {
const res = await fetch("/api/deleverypartners/update-status", {
method: "PUT",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
orderId,
status: newStatus,
}),
});


  const result = await res.json();

  if (result.success) {
    setMyOrders((prev) =>
      prev.map((order) =>
        order._id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  }
} catch (error) {
  console.error("Error updating order status:", error);
}


};

const handleLogout = () => {
localStorage.removeItem("delivery");
router.push("/deleverypartner");
};

if (loading) {
return ( <div className="fixed inset-0 flex items-center justify-center bg-[#fdf6f0] z-50"> <Loader /> </div>
);
}

return ( <div className="min-h-screen bg-[#fdf6f0] text-[#3c2a21] px-6 py-8 font-[Poppins] relative"> <div className="absolute top-2 left-2 z-10"> <Image
       src="/logobg.png"
       alt="VZ Logo"
       width={70}
       height={70}
       className="rounded-full shadow-md"
     /> </div>


  <div className="max-w-5xl mx-auto">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-[#7a3e3e] flex items-center gap-3">
        <FaBoxOpen className="text-[#c96e38]" />
        Your Orders
      </h1>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>

    {myOrders.length === 0 ? (
      <div className="bg-white rounded-xl p-10 text-center shadow">
        <p className="text-lg text-gray-600">
          No orders assigned yet.
        </p>
      </div>
    ) : (
      <div className="flex flex-col gap-6">
        {myOrders.map((item) => (
          <div
            key={item._id}
            className="bg-white/70 backdrop-blur-md shadow-md rounded-xl p-6 border border-[#e2b084]"
          >
            <p className="text-gray-800 font-medium mb-2 flex items-center gap-2">
              <FaUser className="text-[#c96e38]" />
              Customer: {item.firstName} {item.lastName}
            </p>

            <p className="text-gray-800 mb-2 flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#c96e38]" />
              {item.street}, {item.city}, {item.state} - {item.pincode}
            </p>

            <p className="text-gray-800 mb-2 flex items-center gap-2">
              <FaPhone className="text-[#c96e38]" />
              {item.phone || "N/A"}
            </p>

            <p className="text-gray-800 mb-2 flex items-center gap-2">
              <FaEnvelope className="text-[#c96e38]" />
              {item.email || "N/A"}
            </p>

            <p className="text-gray-800 mb-4 flex items-center gap-2">
              <FaRupeeSign className="text-[#c96e38]" />
              Amount: ₹{item.totalAmount}
            </p>

            <div className="flex items-center gap-3">
              <strong>Status:</strong>

              <select
                value={item.status}
                onChange={(e) =>
                  updateOrderStatus(item._id, e.target.value)
                }
                className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c96e38]"
              >
                <option value="confirmed">Confirmed</option>
                <option value="On the way">On the way</option>
                <option value="delivered">Delivered</option>
                <option value="Failed to delivery">
                  Failed to delivery
                </option>
              </select>
            </div>
          </div>
        ))}
      </div>
    )}

    <div className="mt-10 flex justify-center">
      <button
        onClick={() => router.push("/deleverydashboard")}
        className="flex items-center gap-2 px-6 py-3 bg-[#c96e38] text-white rounded-lg shadow hover:bg-[#b3591e] transition"
      >
        <FaArrowLeft />
        Back to Home
      </button>
    </div>
  </div>
</div>


);
};

export default Page;

'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Navbar from '@/app/components/Navbar';
import { MdLocationOn, MdShoppingBag, MdAttachMoney, MdPendingActions } from 'react-icons/md';
import Loader from '@/app/components/Loader';

const Page = () => {
  // const { user, isLoaded } = useUser();
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
      getMyOrders();
    
  }, []);

  const getMyOrders = async () => {
    try {
const userId = JSON.parse(localStorage.getItem("User"))._id;

const res = await fetch(
  `/api/fruit?userId=${encodeURIComponent(userId)}`
);
      const data = await res.json();
console.log(data.result)
      if (data.success) {
        console.log("success true")
        setMyOrders(data.result);
      }
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-[#fdf6f0] min-h-screen font-[Poppins] text-[#3c2a21]">
      <Navbar />

      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3 text-[#7a3e3e] shadow-sm">
          <MdShoppingBag className="text-[#c96e38] text-3xl" /> My Orders
        </h2>

        {myOrders.length === 0 ? (
          <p className="text-center text-[#7a3e3e] italic">No orders found.</p>
        ) : (
          <div className="grid gap-6">
            {myOrders.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 border border-[#e2cfc3] flex flex-col md:flex-row items-start md:items-center gap-4"
              >
                <div className="flex-1">
                
                  <div className="text-sm text-[#7a3e3e] flex items-center gap-2">
                    <MdAttachMoney className="text-[#c96e38]" /> Amount: <span className="font-medium">₹{item.totalAmount}</span>
                  </div>
                  <div className="text-sm text-[#7a3e3e] flex items-center gap-2">
                    <MdLocationOn className="text-[#c96e38]" /> Address: {item.street}, {item.city}, {item.state} - {item.pincode}
                  </div>
                  <div className="text-sm text-[#7a3e3e] flex items-center gap-2">
                    <MdPendingActions className="text-[#c96e38]" /> Status: {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

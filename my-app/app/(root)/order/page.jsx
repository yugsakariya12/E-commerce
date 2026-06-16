"use client";

import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FaCity, FaCreditCard, FaEnvelope, FaGlobe,
  FaHashtag, FaMapMarkerAlt, FaPhone, FaShoppingCart,
  FaTruck, FaUser
} from "react-icons/fa";
import { useHydrated } from "@/app/hooks/useHydrated";

const CheckoutPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", street: "",
    city: "", state: "", pincode: "", country: "", phone: ""
  });
  const hydrated = useHydrated();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [loading, setLoading] = useState(true);

  // ✅ Fix 1: Load cart from MongoDB
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("User"));
        if (!user?._id) {
          toast.error("Please login first");
          router.push("/login");
          return;
        }

        const res = await fetch("/api/cart", {
          headers: { "user-id": user._id },
        });
        const data = await res.json();
        setCartItems(data);

        // ✅ Fix 5: redirect if cart is empty
        if (!data || data.length === 0) {
          toast.error("Your cart is empty!");
          router.push("/Collection");
          return;
        }
      } catch (err) {
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const total = useMemo(() =>
    cartItems.reduce((acc, item) => acc + item.price, 0),
    [cartItems]
  );

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Fix 2: form validation
  const validateForm = () => {
    const required = ["firstName", "lastName", "email", "street", "city", "state", "pincode", "country", "phone"];
    for (const field of required) {
      if (!formData[field].trim()) {
        toast.error(`Please fill in ${field}`);
        return false;
      }
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error("Pincode must be 6 digits");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone must be 10 digits");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Invalid email address");
      return false;
    }
    return true;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const saveOrder = async (orderPayload) => {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    if (!res.ok) throw new Error("Failed to save order");

    // ✅ Fix 6: use item._id not item.id
    for (const item of cartItems) {
      await fetch(`/api/product/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incrementSell: 1 }),
      });
    }

    // ✅ Fix 3: clear cart from MongoDB after order
    const user = JSON.parse(localStorage.getItem("User"));
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, items: [] }), // empty cart in DB
    });

    router.push("/profile");
  };

  const handleOrder = async () => {
    // ✅ Fix 2: validate before proceeding
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // ✅ Fix 4: safe user fetch
      const user = JSON.parse(localStorage.getItem("User"));
      if (!user?._id) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }

      // ✅ Fix 7: city already validated in validateForm so safe here
      const deliveryRes = await fetch("/api/deleverypartners/" + formData.city);
      const deliveryData = await deliveryRes.json();
      const deliveryBoyIds = deliveryData.result?.map((item) => item._id) || [];
      const deliveryBoyId = deliveryBoyIds[Math.floor(Math.random() * deliveryBoyIds.length)];

      if (!deliveryBoyId) {
        toast.error("Delivery not available for your location.");
        setIsProcessing(false);
        return;
      }

      const orderPayload = {
        userId: user._id, // ✅ Fix 4: safe access
        ...formData,
        totalAmount: total + 40,
        status: paymentMethod === "cod" ? "confirmed" : "pending",
        products: cartItems, // ✅ Fix 1: full product snapshots from MongoDB cart
        deliveryBoyId,
      };

      if (paymentMethod === "cod") {
        await saveOrder(orderPayload);
        toast.success("Order placed successfully with Cash on Delivery!");
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay.");
        setIsProcessing(false);
        return;
      }

      const res = await fetch("/api/create-order", { method: "POST" });
      const data = await res.json();
      if (!data.orderId) throw new Error("Order ID not received");

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: (total + 40) * 100,
        currency: "INR",
        name: "VZ Store",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async () => {
          await saveOrder(orderPayload);
          toast.success("Payment successful and order placed!");
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#c96e38" },
      });

      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!hydrated||loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#fdf6f0] z-50">
      <p className="text-[#7a3e3e] text-lg font-semibold">Loading cart...</p>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fdf6f0] text-[#3c2a21] px-6 py-8 font-[Poppins]">
        <Toaster position="top-right" />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl border border-[#e3c4a1] shadow-lg">
            <h2 className="text-2xl font-bold text-[#7a3e3e] mb-4 flex items-center gap-2">
              <FaTruck /> Delivery Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input icon={<FaUser />} name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
              <Input icon={<FaUser />} name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
              <Input icon={<FaEnvelope />} name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="col-span-2" />
              <Input icon={<FaMapMarkerAlt />} name="street" value={formData.street} onChange={handleChange} placeholder="Street Address" className="col-span-2" />
              <Input icon={<FaCity />} name="city" value={formData.city} onChange={handleChange} placeholder="City" />
              <Input icon={<FaGlobe />} name="state" value={formData.state} onChange={handleChange} placeholder="State" />
              <Input icon={<FaHashtag />} name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" />
              <Input icon={<FaGlobe />} name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
              <Input icon={<FaPhone />} name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="col-span-2" />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl border border-[#e3c4a1] shadow-lg">
              <h2 className="text-2xl font-bold text-[#7a3e3e] mb-4 flex items-center gap-2">
                <FaShoppingCart /> Cart Totals
              </h2>
              {/* ✅ show cart items summary */}
              <div className="mb-3 max-h-40 overflow-y-auto flex flex-col gap-2">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="flex justify-between text-sm text-[#3c2a21]">
                    <span>{item.name} ({item.size})</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mb-2"><span>Subtotal</span><span>₹{total}</span></div>
              <div className="flex justify-between mb-2"><span>Shipping Fee</span><span>₹40</span></div>
              <div className="flex justify-between font-bold border-t border-gray-400 pt-2">
                <span>Total</span><span>₹{total + 40}</span>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl border border-[#e3c4a1] shadow-lg">
              <h2 className="text-2xl font-bold text-[#7a3e3e] mb-4 flex items-center gap-2">
                <FaCreditCard /> Choose Payment Method
              </h2>
              <div className="space-y-2 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
                  Online Payment (Razorpay)
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                  Cash on Delivery
                </label>
              </div>
              <button
                onClick={handleOrder}
                disabled={isProcessing}
                className="w-full bg-[#c96e38] hover:bg-[#b3591e] text-white font-semibold py-2 rounded transition duration-200 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Input = ({ icon, name, value, onChange, placeholder, className = "" }) => (
  <div className={`flex items-center gap-2 bg-white px-3 py-2 rounded border border-gray-300 ${className}`}>
    <span className="text-[#c96e38]">{icon}</span>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="flex-1 outline-none bg-transparent text-[#3c2a21]"
    />
  </div>
);

export default CheckoutPage;
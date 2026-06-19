'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiPhone, HiLockClosed } from "react-icons/hi";
import Loader from "@/app/components/Loader";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";

const deleverypartner = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!mobile || !password) {
      setError(true);
      return;
    }

    setError(false);
    setLoading(true);

    try {
      const response = await fetch("/api/deleverypartners/login", {
        method: "POST",
        body: JSON.stringify({ mobile, password }),
      });
      const data = await response.json();
      setLoading(false);

      if (data.success) {
        const { result } = data;
        delete result.password;
        localStorage.setItem("delivery", JSON.stringify(result));
        toast.success("Login successful");
        router.push("/deleverydashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex items-start justify-end overflow-hidden font-[Poppins] px-10 pt-6 relative" style={{ backgroundImage: "url('/bg-vr.jpg')" }}>
      <Toaster position="top-right" />

     {loading && (
  <div className="fixed inset-0 bg-[#fdf6f0] z-50 flex items-center justify-center">
    <Loader />
  </div>
)}

     
      <div className="absolute top-1 left-1 z-10">
        <Image
          src="/logobg.png"
          alt="VZ Logo"
          width={70}
          height={70}
          className="rounded-full shadow-md"
        />
      </div>

   
      <div className="w-[350px] h-[380px] bg-white/30 space-y-3 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-10 shadow-lg mr-36 mt-16 flex flex-col gap-3">
      
        <div className="flex items-center justify-center mb-4 gap-3">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <HiPhone className="text-[#c96e38]" /> Login
          </h2>
        </div>

      
        <div className="flex flex-col gap-5">
          <InputField
            icon={<HiPhone className="text-gray-700" />} 
            label="Mobile"
            value={mobile}
            setValue={setMobile}
            error={error && !mobile}
          />
          <InputField
            type="password"
            icon={<HiLockClosed className="text-gray-700" />} 
            label="Password"
            value={password}
            setValue={setPassword}
            error={error && !password}
          />
        </div>

      
        <button
          onClick={handleLogin}
          className="w-full bg-[#d1794c] hover:bg-[#b9653d] text-white font-semibold py-2.5 rounded-xl transition"
        >
          Login
        </button>

       
        <p className="text-sm text-center text-gray-700 ">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/deleverypartner1")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

const InputField = ({ type = "text", label, value, setValue, error, icon }) => (
  <div className="relative">
    <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600">
      {icon}
    </div>
    <input
      type={type}
      placeholder={`Enter ${label}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={`w-full pl-10 pr-4 py-2.5 text-sm border ${
        error ? "border-red-400" : "border-gray-300"
      } rounded-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#d1794c] placeholder-gray-500`}
    />
    {error && (
      <p className="text-xs text-red-500 mt-1">
        Please enter a valid {label.toLowerCase()}
      </p>
    )}
  </div>
);

export default deleverypartner;

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiMail, HiLockClosed } from "react-icons/hi";
import Loader from "@/app/components/Loader";

const UserLogin = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError(true);
      return;
    }

    setError(false);
    setLoading(true);

    try {
      const res = await fetch("/api/userlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password ,login:true}),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        const user = data.result;
        delete user.password;
        localStorage.setItem("User", JSON.stringify(user));
        router.push("/");
      } else {
        alert("Invalid email or password");
      }
    } catch (err) {
      setLoading(false);
      alert("Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-end overflow-hidden"
      style={{ backgroundImage: "url('/bg-vr.jpg')" }}
    >
      <div className="w-[350px] h-[400px] bg-white/30 backdrop-blur-md border 
      border-white/20 rounded-2xl px-8 py-10 shadow-lg mr-38 flex flex-col gap-3">

        <div className="flex items-center justify-center mb-4 space-x-4">
          <img
            src="/logobg.png"
            alt="VZ Logo"
            className="w-16 h-16 rounded-full object-cover shadow-md"
          />
          <h2 className="text-2xl font-semibold text-gray-800">
            User Login
          </h2>
        </div>

        {/* Input Fields */}
        <div className="flex flex-col gap-5">
          <InputField
            icon={<HiMail className="text-gray-700" />}
            label="Email"
            value={email}
            setValue={setEmail}
            error={error && !email}
          />
          <InputField
            icon={<HiLockClosed className="text-gray-700" />}
            type="password"
            label="Password"
            value={password}
            setValue={setPassword}
            error={error && !password}
          />
        </div>

        {loading ? (
          <Loader />
        ) : (
          <button
            onClick={handleLogin}
            className="w-full bg-[#d1794c] hover:bg-[#b9653d] text-white 
            font-semibold py-2.5 rounded-xl transition"
          >
            Login
          </button>
        )}

        <p className="text-sm text-center text-gray-700">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/sign-up")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Create one
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
      } rounded-lg bg-white/70 backdrop-blur-sm 
        focus:outline-none focus:ring-2 focus:ring-[#d1794c]`}
    />
    {error && (
      <p className="text-xs text-red-500 mt-1">
        Please enter a valid {label.toLowerCase()}
      </p>
    )}
  </div>
);

export default  UserLogin;

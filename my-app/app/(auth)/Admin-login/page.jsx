"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiMail, HiLockClosed } from "react-icons/hi";
import Loader from "@/app/components/Loader";

const AdminLogin = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    const newErrors = {};

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setError({});
    setLoading(true);

    try {
      const response = await fetch("/api/admin-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          login: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Login request failed");
      }

      const data = await response.json();

      if (
        data.success &&
        data.result &&
        data.result._id
      ) {
        const { password, ...safeAdmin } =
          data.result;

        localStorage.setItem(
          "Admin",
          JSON.stringify(safeAdmin)
        );

        router.push("/admin/dashboard");
      } else {
        setError({
          general: "Invalid email or password",
        });
      }
    } catch (err) {
      console.error(err);

      setError({
        general:
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-end overflow-hidden"
      style={{
        backgroundImage: "url('/bg-vr.jpg')",
      }}
    >
      <div
        className="w-[350px] min-h-[420px] bg-white/30 backdrop-blur-md
        border border-white/20 rounded-2xl px-8 py-10 shadow-lg mr-38
        flex flex-col gap-4"
      >
        <div className="flex items-center justify-center mb-4 space-x-4">
          <img
            src="/logobg.png"
            alt="VZ Logo"
            className="w-16 h-16 rounded-full object-cover shadow-md"
          />

          <h2 className="text-2xl font-semibold text-gray-800">
            Admin Login
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          <InputField
            icon={<HiMail className="text-gray-700" />}
            label="Email"
            value={email}
            setValue={setEmail}
            error={error.email}
            setError={setError}
            handleLogin={handleLogin}
          />

          <InputField
            icon={
              <HiLockClosed className="text-gray-700" />
            }
            type="password"
            label="Password"
            value={password}
            setValue={setPassword}
            error={error.password}
            setError={setError}
            handleLogin={handleLogin}
          />
        </div>

        {error.general && (
          <p className="text-red-500 text-sm text-center">
            {error.general}
          </p>
        )}

        {loading ? (
          <Loader />
        ) : (
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#d1794c] hover:bg-[#b9653d]
            disabled:opacity-60 disabled:cursor-not-allowed
            text-white font-semibold py-2.5 rounded-xl transition"
          >
            Login
          </button>
        )}

        <p className="text-sm text-center text-gray-700">
          Don’t have an account?{" "}
          <span
            onClick={() =>
              router.push("/admin-sign-up")
            }
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

const InputField = ({
  type = "text",
  label,
  value,
  setValue,
  error,
  icon,
  setError,
  handleLogin,
}) => (
  <div className="relative">
    <div
      className="absolute top-1/2 left-3
      transform -translate-y-1/2 text-gray-600"
    >
      {icon}
    </div>

    <input
      type={type}
      placeholder={`Enter ${label}`}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);

        setError((prev) => ({
          ...prev,
          [label.toLowerCase()]: "",
          general: "",
        }));
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleLogin();
        }
      }}
      className={`w-full pl-10 pr-4 py-2.5 text-sm border
      ${
        error
          ? "border-red-400"
          : "border-gray-300"
      }
      rounded-lg bg-white/70 backdrop-blur-sm
      focus:outline-none focus:ring-2
      focus:ring-[#d1794c]`}
    />

    {error && (
      <p className="text-xs text-red-500 mt-1">
        {error}
      </p>
    )}
  </div>
);

export default AdminLogin;
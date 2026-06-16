
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiUser,
  HiMail,
  HiLockClosed,
  HiPhone,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";

import Loader from "@/app/components/Loader";

const UserSignUp = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    contact: "",
    password: "",
    c_password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Enter a valid 10-digit contact number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formData.c_password) {
      newErrors.c_password = "Confirm password is required";
    } else if (
      formData.password !== formData.c_password
    ) {
      newErrors.c_password = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setApiError("");

      const res = await fetch("/api/userlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          contact: formData.contact,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setApiError(
          data.message || "Unable to create account"
        );
        return;
      }

      if (data.result?.password) {
        delete data.result.password;
      }

      localStorage.setItem(
        "User",
        JSON.stringify(data.result)
      );

      router.push("/");
    } catch (error) {
      console.error(error);
      setApiError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/signin");
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-end overflow-hidden"
      style={{
        backgroundImage: "url('/bg-vr.jpg')",
      }}
    >
      <div className="w-[420px] bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-4 shadow-lg mr-24">
        {/* Header */}
        <div className="flex items-center justify-center mb-4 gap-2">
          <img
            src="/logobg.png"
            alt="Logo"
            className="w-14 h-14 rounded-full object-cover shadow-md"
          />

          <h2 className="text-2xl font-semibold text-gray-800">
            Create User Account
          </h2>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="mb-3 rounded-lg bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-600">
            {apiError}
          </div>
        )}

        <div className="space-y-3">
          <InputField
            icon={<HiUser />}
            label="Name"
            value={formData.name}
            onChange={(value) =>
              handleChange("name", value)
            }
            error={errors.name}
          />

          <InputField
            icon={<HiUser />}
            label="Username"
            value={formData.username}
            onChange={(value) =>
              handleChange("username", value)
            }
            error={errors.username}
          />

          <InputField
            icon={<HiMail />}
            label="Email"
            value={formData.email}
            onChange={(value) =>
              handleChange("email", value)
            }
            error={errors.email}
          />

          <InputField
            icon={<HiPhone />}
            label="Contact Number"
            value={formData.contact}
            onChange={(value) =>
              handleChange("contact", value)
            }
            error={errors.contact}
          />

          <PasswordField
            label="Password"
            value={formData.password}
            onChange={(value) =>
              handleChange("password", value)
            }
            error={errors.password}
            show={showPassword}
            toggle={() =>
              setShowPassword(!showPassword)
            }
          />

          <PasswordField
            label="Confirm Password"
            value={formData.c_password}
            onChange={(value) =>
              handleChange("c_password", value)
            }
            error={errors.c_password}
            show={showConfirmPassword}
            toggle={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
          />
        </div>

        <div className="mt-5">
          {loading ? (
            <Loader />
          ) : (
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-[#d1794c] hover:bg-[#b9653d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition"
            >
              Create Account
            </button>
          )}
        </div>

        <p className="text-sm text-center text-gray-700 mt-3">
          Already have an account?{" "}
          <span
            onClick={handleLogin}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  value,
  onChange,
  error,
  icon,
  type = "text",
}) => {
  return (
    <div>
      <div className="relative">
        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-600">
          {icon}
        </div>

        <input
          type={type}
          placeholder={`Enter ${label}`}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#d1794c]
          ${
            error
              ? "border-red-400"
              : "border-gray-300"
          }`}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

const PasswordField = ({
  label,
  value,
  onChange,
  error,
  show,
  toggle,
}) => {
  return (
    <div>
      <div className="relative">
        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-600">
          <HiLockClosed />
        </div>

        <input
          type={show ? "text" : "password"}
          placeholder={`Enter ${label}`}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className={`w-full pl-10 pr-12 py-2.5 text-sm border rounded-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#d1794c]
          ${
            error
              ? "border-red-400"
              : "border-gray-300"
          }`}
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
        >
          {show ? <HiEyeOff /> : <HiEye />}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default UserSignUp;


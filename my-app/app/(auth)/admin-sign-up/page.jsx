"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiUser,
  HiMail,
  HiLockClosed,
  HiPhone,
  HiLocationMarker,
  HiOfficeBuilding,
  HiHome,
} from "react-icons/hi";
import { toast, Toaster } from "react-hot-toast";

import Loader from "@/app/components/Loader";

const MAX_IMAGE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const AdminSignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [c_password, setC_password] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handlelogin = () => {
    router.push("/Admin-login");
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidContact = (value) => /^\+?[0-9]{7,15}$/.test(value.trim());

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WEBP image");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_IMAGE_MB}MB`);
      e.target.value = "";
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSignup = async () => {
    if (loading) return;

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    const trimmedCity = city.trim();
    const trimmedAddress = address.trim();
    const trimmedContact = contact.trim();
    const trimmedCompany = company.trim();

    if (
      !trimmedEmail ||
      !password ||
      !c_password ||
      !trimmedName ||
      !trimmedCity ||
      !trimmedAddress ||
      !trimmedContact ||
      !trimmedCompany
    ) {
      setError(true);
      setPasswordError(false);
      toast.error("Please fill in all fields");
      return;
    }
    setError(false);

    if (!isValidEmail(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!isValidContact(trimmedContact)) {
      toast.error("Please enter a valid contact number");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== c_password) {
      setPasswordError(true);
      return;
    }
    setPasswordError(false);

    const formData = new FormData();
    formData.append("email", trimmedEmail);
    formData.append("password", password);
    formData.append("name", trimmedName);
    formData.append("city", trimmedCity);
    formData.append("address", trimmedAddress);
    formData.append("contact", trimmedContact);
    formData.append("company", trimmedCompany);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin-signup", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error("Signup response was not valid JSON:", parseErr);
        toast.error("Something went wrong on our end. Please try again.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        toast.error(data?.message || "Sign up failed. Please try again.");
        setLoading(false);
        return;
      }

      if (data?.success && data?.result) {
        const resultCopy = { ...data.result };
        delete resultCopy.password;
        localStorage.setItem("Admin", JSON.stringify(resultCopy));
        toast.success("Account created successfully");
        router.push("/admin/dashboard");
      } else {
        toast.error(data?.message || "Sign up failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Signup failed:", err);
      toast.error("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-end overflow-scroll"
      style={{ backgroundImage: "url('/bg-vr.jpg')" }}
    >
      <Toaster position="top-right" />

    <div className="w-[420px] h-[650px] bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-2 mt-2 mb-2 shadow-lg mr-24">
        <div className="flex items-center justify-center mb-3.5 mt-0 space-x-2">
          <img
            src="/logobg.png"
            alt="VZ Logo"
            className="w-15 h-15 rounded-full object-cover shadow-md"
          />
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Admin Account
          </h2>
        </div>

        <div className="space-y-3">
          <InputField icon={<HiUser className="text-gray-700" />} label="Full Name" value={name} setValue={setName} error={error && !name.trim()} />
          <InputField icon={<HiMail className="text-gray-700" />} label="Email" value={email} setValue={setEmail} error={error && !email.trim()} />
          <InputField icon={<HiHome className="text-gray-700" />} label="Company" value={company} setValue={setCompany} error={error && !company.trim()} />

          <div className="relative">
            <label className="flex items-center justify-between w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white/70 backdrop-blur-sm cursor-pointer hover:border-[#d1794c] transition">
              <span className="text-gray-600 text-sm truncate max-w-[60%]">
                {profileImage ? profileImage.name : "Upload Company Logo"}
              </span>
              <span className="bg-[#d1794c] text-white px-3 py-1 rounded-md text-xs">
                Browse
              </span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {previewUrl && (
              <div className="mt-2 flex justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-16 w-16 rounded-full object-cover border"
                />
              </div>
            )}
          </div>

          <InputField icon={<HiLockClosed className="text-gray-700" />} type="password" label="Password" value={password} setValue={setPassword} error={(error && !password) || passwordError} />
          <InputField icon={<HiLockClosed className="text-gray-700" />} type="password" label="Confirm Password" value={c_password} setValue={setC_password} error={(error && !c_password) || passwordError} />
          <InputField icon={<HiOfficeBuilding className="text-gray-700" />} label="City" value={city} setValue={setCity} error={error && !city.trim()} />
          <InputField icon={<HiLocationMarker className="text-gray-700" />} label="Address" value={address} setValue={setAddress} error={error && !address.trim()} />
          <InputField icon={<HiPhone className="text-gray-700" />} label="Contact Number" value={contact} setValue={setContact} error={error && !contact.trim()} />
        </div>

        {passwordError && (
          <p className="text-sm text-red-600 mt-2 text-center">
            Passwords do not match
          </p>
        )}

        <div className="mt-5">
          {loading ? (
            <div className="flex justify-center scale-75">
              <Loader />
            </div>
          ) : (
            <button
              onClick={handleSignup}
              className="w-full bg-[#d1794c] hover:bg-[#b9653d] text-white font-semibold py-2.5 rounded-xl transition"
            >
              Create Account
            </button>
          )}
        </div>

        <p className="text-sm text-center text-gray-700 mt-2">
          Already have an account?{" "}
          <span onClick={handlelogin} className="text-blue-600 font-medium cursor-pointer hover:underline">
            Log in
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
      className={`w-full pl-10 pr-4 py-2.5 text-sm border ${error ? 'border-red-400' : 'border-gray-300'} rounded-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#d1794c] placeholder-gray-500`}
    />
    {error && <p className="text-xs text-red-500 mt-1">Please enter a valid {label.toLowerCase()}</p>}
  </div>
);

export default AdminSignUp;
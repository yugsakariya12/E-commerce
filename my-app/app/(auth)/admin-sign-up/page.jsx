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

import Loader from "@/app/components/Loader"; // ⬅️ Add correct path based on your structure
import { HideImage } from "@mui/icons-material";

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
  const [loading, setLoading] = useState(false); // ⬅️ Add loading state
const [profileImage, setProfileImage] = useState(null);

  const handlelogin = () => {
    router.push("/Admin-login");
  };

  const handleSignup = async () => {
    if (password !== c_password) return setPasswordError(true);
    if (!email || !password || !c_password || !name || !city || !address || !contact||!company) {
      return setError(true);
    }
const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("name", name);
  formData.append("city", city);
  formData.append("address", address);
  formData.append("contact", contact);
  formData.append("company", company);
    setLoading(true); 
if (profileImage) {
    formData.append("profileImage", profileImage);
  }

    try {
     setLoading(true);

  const res = await fetch("/api/admin-signup", {
    method: "POST",
    body: formData, 
  });
    

      const data = await res.json();
      setLoading(false); 

      if (data.success) {
        delete data.result.password;
        localStorage.setItem("Admin", JSON.stringify(data.result));
        router.push("/admin/dashboard");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-end overflow-scroll"
      style={{ backgroundImage: "url('/bg-vr.jpg')" }}
    >
      <div className="w-[420px] h-[650px] bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-2 mt-2 mb-2 shadow-lg mr-24">
        {/* Logo and Title */}
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

        {/* Form Fields */}
        <div className="space-y-3">
          <InputField icon={<HiUser className="text-gray-700" />} label="Full Name" value={name} setValue={setName} error={error && !name} />
          <InputField icon={<HiMail className="text-gray-700" />} label="Email" value={email} setValue={setEmail} error={error && !email} />
          <InputField icon={<HiHome className="text-gray-700" />} label="company" value={company} setValue={setCompany} error={error && !company} />

<div className="relative">
  <label className="flex items-center justify-between w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white/70 backdrop-blur-sm cursor-pointer hover:border-[#d1794c] transition">
    
    <span className="text-gray-600 text-sm">
      {profileImage
        ? profileImage.name
        : "Upload Company Logo"}
    </span>

    <span className="bg-[#d1794c] text-white px-3 py-1 rounded-md text-xs">
      Browse
    </span>

    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) =>
        setProfileImage(e.target.files[0])
      }
    />
  </label>

  {profileImage && (
    <div className="mt-2 flex justify-center">
      <img
        src={URL.createObjectURL(profileImage)}
        alt="Preview"
        className="h-16 w-16 rounded-full object-cover border"
      />
    </div>
  )}
</div>



          <InputField icon={<HiLockClosed className="text-gray-700" />} type="password" label="Password" value={password} setValue={setPassword} error={error && !password || passwordError} />
          <InputField icon={<HiLockClosed className="text-gray-700" />} type="password" label="Confirm Password" value={c_password} setValue={setC_password} error={error && !c_password || passwordError} />
          <InputField icon={<HiOfficeBuilding className="text-gray-700" />} label="City" value={city} setValue={setCity} error={error && !city} />
          <InputField icon={<HiLocationMarker className="text-gray-700" />} label="Address" value={address} setValue={setAddress} error={error && !address} />
          <InputField icon={<HiPhone className="text-gray-700" />} label="Contact Number" value={contact} setValue={setContact} error={error && !contact} />
        </div>

        {passwordError && (
          <p className="text-sm text-red-600 mt-2 text-center">
            Passwords do not match
          </p>
        )}

        {/* Submit Button or Loader */}
        <div className="mt-5">
          {loading ? (
          <div className="scale-75">
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

        {/* Login Link */}
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

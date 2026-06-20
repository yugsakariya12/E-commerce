




"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NewCollection from "../components/NewCollection";
import BestSeller from "../components/BestSeller";
import "@fontsource/playfair-display";
import "@fontsource/cormorant-garamond";
import { FaExchangeAlt, FaHeadset, FaUser, FaStore, FaTruck } from "react-icons/fa";
import { MdOutlineAssignmentReturn } from "react-icons/md";

const images = [
  "/hero5.png",
  "/hero2.jpeg",
  "/hero3.jpeg",
  "/hero4.jpeg"
];

const Page = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [fadeIn, setFadeIn] = useState(true);
  const [showRoleSelect, setShowRoleSelect] = useState(false); // NEW

  const handleChange = (index) => {
    if (index === currentIndex) return;
    setFadeIn(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFadeIn(true);
    }, 250);
  };

  // NEW: role -> route map, then redirect
  const handleRoleSelect = (role) => {
    if (role === "user") router.push("/sign-up");
    else if (role === "owner") router.push("/admin-sign-up");
    else if (role === "delivery") router.push("/deleverypartner");
  };

  useEffect(() => {
    // Preload images
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Auto-advance carousel
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    // Auth check — CHANGED: instead of auto-redirecting to /sign-up,
    // show the role selection screen if no valid user is found
    try {
      const storedUser = localStorage.getItem("User");

      if (!storedUser) {
        setShowRoleSelect(true);
        setCheckingAuth(false);
        return () => clearInterval(timer);
      }

      const user = JSON.parse(storedUser);

      if (!user || !user._id) {
        localStorage.removeItem("User");
        setShowRoleSelect(true);
        setCheckingAuth(false);
        return () => clearInterval(timer);
      }

      // valid logged-in user — show homepage normally
      setCheckingAuth(false);
    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("User");
      setShowRoleSelect(true);
      setCheckingAuth(false);
    }

    return () => clearInterval(timer);
  }, []);

  if (checkingAuth) {
    return null;
  }

  // NEW: Role selection screen — shown instead of auto-redirect
  if (showRoleSelect) {
    return (
      <div className="min-h-screen bg-[#fffaf4] flex flex-col items-center justify-center font-[Cormorant_Garamond] text-[#3c2a21] px-6">
        <img src="/logobg.png" alt="Vibe Zone Logo" className="w-16 h-16 rounded-full shadow-md mb-6" />
        <h1 className="text-3xl md:text-4xl font-semibold mb-2 text-center">
          Welcome to <span className="text-[#c96e38] italic">VIBE ZONE</span>
        </h1>
        <p className="text-lg text-[#7a3e3e] mb-10 text-center">
          Continue as
        </p>

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
          <button
            onClick={() => handleRoleSelect("user")}
            className="flex-1 flex flex-col items-center gap-3 bg-[#fceedd] hover:bg-[#f5e3c3] border border-[#dabfa6] rounded-xl py-8 px-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <FaUser className="text-4xl text-[#c96e38]" />
            <span className="text-xl font-semibold">User</span>
            <span className="text-sm text-[#7a3e3e]">Login / Sign Up</span>
          </button>

          <button
            onClick={() => handleRoleSelect("owner")}
            className="flex-1 flex flex-col items-center gap-3 bg-[#fceedd] hover:bg-[#f5e3c3] border border-[#dabfa6] rounded-xl py-8 px-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <FaStore className="text-4xl text-[#c96e38]" />
            <span className="text-xl font-semibold">Owner</span>
            <span className="text-sm text-[#7a3e3e]">Login / Sign Up</span>
          </button>

          <button
            onClick={() => handleRoleSelect("delivery")}
            className="flex-1 flex flex-col items-center gap-3 bg-[#fceedd] hover:bg-[#f5e3c3] border border-[#dabfa6] rounded-xl py-8 px-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <FaTruck className="text-4xl text-[#c96e38]" />
            <span className="text-xl font-semibold">Delivery Partner</span>
            <span className="text-sm text-[#7a3e3e]">Login / Sign Up</span>
          </button>
        </div>
      </div>
    );
  }


  return (
   <>
      <Navbar />

    
      <div className="min-h-[500px] bg-[#f5e3c3] flex flex-col md:flex-row items-center justify-between font-[Cormorant_Garamond] text-[#3c2a21]">
        <div className="w-full md:w-1/2 flex flex-col gap-2 justify-center pl-8 pr-4 py-8 md:py-0">
          <div className="text-[#7a3e3e] text-4xl md:text-5xl font">
            30% <span className="font-bold text-5xl md:text-6xl text-[#c96e38]">OFF</span> Limited Offer
          </div>
          <div className="text-[#7a3e3e] text-4xl md:text-5xl italic">Style that Defines You</div>
          <div className="flex flex-row py-8 md:py-16 gap-3">
          
            {images.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => handleChange(index)}
                className={`h-[15px] w-[15px] rounded-full cursor-pointer border-none outline-none ${
                  currentIndex === index
                    ? "bg-[#c96e38] scale-110 shadow-md"
                    : "bg-[#7a3e3e] opacity-40"
                } transition-all duration-200`}
              />
            ))}
          </div>
        </div>

     
        <div className="h-[260px] w-full md:h-[500px] md:w-[62vw] overflow-hidden rounded-none md:rounded-l-xl shadow-xl">
          <img
            className={`h-full w-full object-cover object-center transition-opacity duration-300 ${
              fadeIn ? "opacity-100" : "opacity-0"
            }`}
            src={images[currentIndex]}
            alt={`Fashion showcase slide ${currentIndex + 1}`}
          />
        </div>
      </div>

      <div className="bg-[#fffaf4]">
        <NewCollection />
        <BestSeller />

        <div className="py-14 px-6 mt-8 font-[Cormorant_Garamond] text-[#5a2e2e]">
          <h2 className="text-4xl font-semibold text-center mb-2">
            OUR <span className="text-[#c96e38]">POLICY</span>
          </h2>
          <p className="text-center text-lg mb-10 text-[#7a3e3e]">
            Customer-Friendly Policies – Committed to Your Satisfaction and Safety.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-10">
            <div className="flex flex-col items-center text-center max-w-xs">
              <FaExchangeAlt className="text-4xl mb-3 text-[#c96e38]" />
              <h4 className="text-xl font-semibold mb-1">Easy Exchange Policy</h4>
              <p>Exchange Made Easy – Quick, Simple, and Customer-Friendly Process.</p>
            </div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <MdOutlineAssignmentReturn className="text-4xl mb-3 text-[#c96e38]" />
              <h4 className="text-xl font-semibold mb-1">7 Days Return Policy</h4>
              <p>Shop with Confidence – 7 Days Easy Return Guarantee.</p>
            </div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <FaHeadset className="text-4xl mb-3 text-[#c96e38]" />
              <h4 className="text-xl font-semibold mb-1">Best Customer Support</h4>
              <p>Trusted Customer Support – Your Satisfaction Is Our Priority.</p>
            </div>
          </div>
        </div>

        <footer className="w-full bg-[#fceedd] text-[#5a2e2e] font-[Cormorant_Garamond] text-sm pt-8 pb-4 px-6 border-t border-[#dabfa6]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">

            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-2">
                <img src="/logobg.png" alt="Vibe Zone Logo" className="w-10 h-10 rounded-full shadow-sm" />
                <span className="text-xl font-bold italic tracking-wide text-[#c96e38]">VIBE ZONE</span>
              </div>
              <p className="leading-snug text-[15px]">
                Your destination for premium Indian ethnic fashion, curated with care and rooted in culture.
              </p>
            </div>

     
            <div className="flex flex-col gap-1 text-[15px]">
              <h4 className="text-lg font-bold mb-1 text-[#c96e38]">COMPANY</h4>
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/about" className="hover:underline">About Us</Link>
              <Link href="/delivery" className="hover:underline">Delivery</Link>
              <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            </div>

            <div className="flex flex-col gap-1 text-[15px]">
              <h4 className="text-lg font-bold mb-1 text-[#c96e38]">GET IN TOUCH</h4>
              <p>+91-9876543210</p>
              <p>contact@vibezone.com</p>
              <p>+1-123-456-7890</p>
              <p>admin@vibezone.com</p>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#e2cbb2] text-center text-[13px] text-[#7b5241]">
            © 2025 VibeZone. All Rights Reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default Page;
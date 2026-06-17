'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import {
  FaTags,
  FaInfoCircle,
  FaShoppingCart,
  FaClipboardCheck,
  FaHome
} from 'react-icons/fa';

const Navbar = () => {
  const router = useRouter();
  // const { isSignedIn, isLoaded } = useUser();

  // useEffect(() => {
  //   if (isLoaded && !isSignedIn) {
  //     router.push('/sign-up');
  //   }
  // }, [isLoaded, isSignedIn, router]);

  return (
    <nav className="bg-[#c96e38] h-[10vh] shadow-md px-6 flex items-center justify-between flex-wrap gap-4">
     
      <div className="flex items-center space-x-3">
        <Image
          src="/logobg.png"
          alt="VZ Logo"
          width={52}
          height={52}
          className="rounded-full shadow-sm"
        />
        <span className="text-[26px] font-semibold italic tracking-wide text-[#fbe3cb] font-[Cormorant_Garamond] drop-shadow-sm">
          VIBE ZONE
        </span>
      </div>

     
      <div className="flex gap-3 flex-wrap justify-center items-center">
        <Link href="/">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#fbe3cb] text-[#7a3e3e] rounded-lg shadow hover:bg-[#f1d1a4] transition font-semibold cursor-pointer text-sm">
            <FaHome className="text-[#c96e38] text-base" />
            <span>Home</span>
          </div>
        </Link>

        <Link href="/Collection">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#fbe3cb] text-[#7a3e3e] rounded-lg shadow hover:bg-[#f1d1a4] transition font-semibold cursor-pointer text-sm">
            <FaTags className="text-[#c96e38] text-base" />
            <span>Collections</span>
          </div>
        </Link>

        <Link href="/About">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#fbe3cb] text-[#7a3e3e] rounded-lg shadow hover:bg-[#f1d1a4] transition font-semibold cursor-pointer text-sm">
            <FaInfoCircle className="text-[#c96e38] text-base" />
            <span>About</span>
          </div>
        </Link>

        <Link href="/cart">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#fbe3cb] text-[#7a3e3e] rounded-lg shadow hover:bg-[#f1d1a4] transition font-semibold cursor-pointer text-sm">
            <FaShoppingCart className="text-[#c96e38] text-base" />
            <span>Cart</span>
          </div>
        </Link>

        <Link href="/profile">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#fbe3cb] text-[#7a3e3e] rounded-lg shadow hover:bg-[#f1d1a4] transition font-semibold cursor-pointer text-sm">
            <FaClipboardCheck className="text-[#c96e38] text-base" />
            <span>My Orders</span>
          </div>
        </Link>

     
      </div>
    </nav>
  );
};

export default Navbar;

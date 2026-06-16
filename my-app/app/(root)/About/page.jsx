"use client";

import Navbar from "@/app/components/Navbar";
import "@fontsource/playfair-display";
import "@fontsource/cormorant-garamond";
import { FaShippingFast, FaHeadset } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const About = () => {
  return (
    <>
      <Navbar />

      <div className="bg-[#fffaf4] text-[#3c2a21] font-[Cormorant_Garamond] px-6 md:px-20 py-12 space-y-11">
        
        {/* ABOUT US */}
        <section className="flex flex-col md:flex-row items-center gap-10">
          <img
            src="/hero2.jpeg"
            alt="About Vibe Zone"
            className="w-full md:w-1/2 rounded-xl shadow-lg object-cover"
          />
          <div className="md:w-1/2 space-y-2">
            <h1 className="text-4xl md:text-5xl font-semibold text-[#c96e38] mb-3">
              ABOUT <span className="text-[#7a3e3e]">US</span>
            </h1>
            <p className="text-lg font-semibold leading-relaxed">
              Vibe Zone was born to redefine the ethnic shopping experience—curated for modern shoppers who crave both tradition and trend. With premium Indian fashion, seamless delivery, and customer-first service, we make every experience memorable.
            </p>
            <p className="text-lg font-semibold leading-relaxed">
              Whether it's sarees, kurtas, or accessories—our handpicked collections deliver on elegance, value, and satisfaction. Fast shipping, easy returns, and 100% style guaranteed.
            </p>
            <h2 className="text-2xl font-bold mt-6 text-[#7a3e3e]">Our Mission</h2>
            <p className="text-lg font-semibold leading-relaxed">
              To empower style through tradition. We connect customers with timeless Indian fashion, reliable service, and a stress-free shopping experience—delivered with love.
            </p>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="text-center my-2 pt-10">
          <h2 className="text-4xl font-bold text-[#b97c45]">
            WHY <span className="text-[#7a3e3e]">CHOOSE US</span>
          </h2>

          <div className="grid grid-cols-1 my-6 md:grid-cols-3 gap-8 text-left">
            <div className="border p-6 rounded-xl shadow-md bg-white">
              <MdVerified className="text-3xl mb-3 text-[#c96e38]" />
              <h3 className="text-xl font-bold mb-2 text-[#7a3e3e]">Quality Assurance</h3>
              <p className="text-base font-semibold leading-relaxed">
                Strict quality checks, reliable sourcing, and a promise to keep your satisfaction first—always.
              </p>
            </div>
            <div className="border p-6 rounded-xl shadow-md bg-white">
              <FaShippingFast className="text-3xl mb-3 text-[#c96e38]" />
              <h3 className="text-xl font-bold mb-2 text-[#7a3e3e]">Convenience</h3>
              <p className="text-base font-semibold leading-relaxed">
                Enjoy fast delivery, secure checkout, and everything you need in one smooth experience.
              </p>
            </div>
            <div className="border p-6 rounded-xl shadow-md bg-white">
              <FaHeadset className="text-3xl mb-3 text-[#c96e38]" />
              <h3 className="text-xl font-bold mb-2 text-[#7a3e3e]">Exceptional Support</h3>
              <p className="text-base font-semibold leading-relaxed">
                Quick responses, helpful solutions, and a support team that puts you first every single time.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;

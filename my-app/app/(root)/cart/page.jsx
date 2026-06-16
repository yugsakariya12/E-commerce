'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '@/app/components/Navbar';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdShoppingCartCheckout, MdPayments, MdDelete } from 'react-icons/md';
import { FaShoppingCart, FaRupeeSign } from 'react-icons/fa';
import Loader from '@/app/components/Loader';
import { toast, Toaster } from 'react-hot-toast';

const Page = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ GET - Load cart from MongoDB
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('User')); // ✅
        const userId = user?._id;

        if (!userId) {
          toast.error('Please login first');
          router.push('/login');
          return;
        }

        const res = await fetch('/api/cart', {
          headers: { 'user-id': userId },
        });
        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const total = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price, 0),
    [cartItems]
  );

  // ✅ DELETE - Remove one item by cartId
  const handleRemove = async (cartId) => {
    try {
      const user = JSON.parse(localStorage.getItem('User')); // ✅
      const userId = user?._id;

      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, cartId }),
      });

      const updatedItems = await res.json();
      setCartItems(updatedItems);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleBack = () => router.push('/Collection');
  const handleOrder = () => router.push('/order');

  if (loading) return (
  <div className="fixed inset-0 flex items-center justify-center bg-[#fdf6f0] z-50">
    <Loader />
  </div>
);

  return (
    <div className="bg-[#fdf6f0] min-h-screen font-[Poppins] text-[#3c2a21]">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3 text-[#7a3e3e] shadow-sm">
          <FaShoppingCart className="text-[#c96e38] text-3xl" /> Your Cart
        </h2>

        <div className="flex flex-col gap-5 mb-20">
          {cartItems.length === 0 ? (
            <p className="text-[#7a3e3e] text-lg text-center italic">
              Oops! Your cart is feeling a little empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <div key={item.cartId} className="bg-white rounded-xl shadow-md p-4 border border-[#e2cfc3]">
                <div className="flex flex-row gap-6 w-full justify-between">
                  <div className="flex flex-row gap-4 items-center">
                    <img
                      src={item.photo}
                      className="w-[100px] h-[100px] object-cover rounded-md border border-[#e2cfc3]"
                      alt="item"
                    />
                    <div className="flex flex-col justify-start text-left pl-4">
                      <p className="text-xl font-semibold text-[#3c2a21]">{item.name}</p>
                      <p className="text-sm text-[#7a3e3e]">Size: <span className="font-medium">{item.size}</span></p>
                      <p className="text-sm text-[#7a3e3e]">Quantity: <span className="font-medium">1</span></p>
                      <p className="text-md font-bold text-[#c96e38] flex items-center gap-1">
                        <FaRupeeSign />{item.price}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.cartId)}
                    className="text-[#c96e38] hover:text-[#b55d2f] transition text-2xl mr-2"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 fixed bottom-0 left-0 right-0 bg-[#fdf6f0] shadow-[0_-2px_10px_rgba(0,0,0,0.1)] px-4 py-3 border-t border-[#caa88a] z-50">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 bg-[#caa88a] text-white px-5 py-2.5 rounded-xl hover:bg-[#b88c6a] transition duration-300 shadow-sm"
          >
            <MdArrowBack className="text-xl" /> Back to Collection
          </button>

          <p className="flex items-center gap-2 text-lg text-[#3c2a21] font-semibold">
            <MdPayments className="text-[#c96e38] text-2xl" /> Total: ₹{total}
          </p>

          <button
            onClick={handleOrder}
            className="flex items-center gap-2 bg-[#c96e38] text-white px-5 py-2.5 rounded-xl hover:bg-[#b55d2f] transition duration-300 shadow-sm"
          >
            <MdShoppingCartCheckout className="text-xl" /> Order Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
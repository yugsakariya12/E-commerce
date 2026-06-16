'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import CollectionCard from '@/app/components/CollectionCard';
import Loader from '@/app/components/Loader';
import Navbar from '@/app/components/Navbar';
import { FaFilter, FaTags } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast'; // ✅ Fix 6: added toast

const Page = () => {
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [feedPost, setFeedPost] = useState([]);
  const [selectedSort, setSelectedSort] = useState('');
  const [load, setLoad] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const differ = (id) => router.push('/differ/' + id);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fix 3: sorting helper reused in both fetchData and sort useEffect
  const applySorting = (list, sort) => {
    let sorted = [...list];
    if (sort === 'priceLowHigh') {
      sorted.sort((a, b) => a.Price - b.Price);
    } else if (sort === 'priceHighLow') {
      sorted.sort((a, b) => b.Price - a.Price);
    } else if (sort === 'mostSelling') {
      sorted.sort((a, b) => (b.sells || 0) - (a.sells || 0));
    }
    return sorted;
  };

  const fetchData = async () => {
    setLoad(true);
    try {
      const res = await fetch('/api/formdata/collection');
      const data = await res.json();
      let filtered = Array.isArray(data.result) ? data.result : [];
      if (category) filtered = filtered.filter((item) => item.category === category);
      if (subCategory) filtered = filtered.filter((item) => item.subCategory === subCategory);

      setAllPosts(filtered);

      // ✅ Fix 3: apply existing sort after fetch so sort is not lost
      const sorted = applySorting(filtered, selectedSort);
      setFeedPost(sorted);

    } catch (error) {
      console.error('Fetch error:', error);
      setFeedPost([]);
      toast.error('Failed to load products'); // ✅ Fix 6
    }
    setLoad(false);
  };

  // ✅ Fix 2: fetchData only runs after mounted
  useEffect(() => {
    if (mounted) fetchData();
  }, [category, subCategory, mounted]);

  // ✅ Fix 1: always sort from allPosts, guard if empty
  useEffect(() => {
    if (!allPosts.length) return;
    const sorted = applySorting(allPosts, selectedSort);
    setFeedPost(sorted);
  }, [selectedSort]);

  const handledropChange = (e) => setSelectedSort(e.target.value);

  if (!mounted || load) return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#fdf6f0] z-50">
      <Loader />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdf6f0] text-[#3c2a21] font-[Poppins]">
      <Toaster position="top-center" />
      <Navbar />

      {/* Mobile filters */}
      <div className="md:hidden px-4 py-3 flex flex-col gap-2">
        <div className="flex overflow-x-auto gap-2 scrollbar-hide">
          {['All', 'Men', 'Women', 'Children'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === 'All' ? '' : cat)}
              className={`px-3 py-1 rounded-full border text-sm flex-shrink-0 whitespace-nowrap transition-all duration-150 ${
                // ✅ Fix 5: All button highlights correctly
                (cat === 'All' && category === '') || category === cat
                  ? 'bg-[#c96e38] text-white'
                  : 'text-[#7a3e3e] border-[#caa88a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <select
          value={selectedSort}
          onChange={handledropChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#c96e38]"
        >
          <option value="">Sort By</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="mostSelling">Most Selling</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row md:h-[calc(100vh-4rem)]">

        {/* Desktop sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="hidden md:block md:w-1/4 border-r border-[#caa88a] p-4 overflow-y-auto"
        >
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#7a3e3e] mb-2">
              <FaFilter /> Filter by Category
            </h2>
            {['', 'Men', 'Women', 'Children'].map((cat) => (
              <label
                key={cat}
                className={`block text-sm mb-2 px-2 py-1 rounded cursor-pointer ${
                  category === cat ? 'bg-[#fbe3cb] text-[#7a3e3e]' : 'text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={category === cat}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mr-2 accent-[#c96e38]"
                />
                {cat || 'All'}
              </label>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#7a3e3e] mb-2">
              <FaTags /> Filter by Subcategory
            </h2>
            {['', 'Topwear', 'Bottomwear', 'Casualwear'].map((sub) => (
              <label
                key={sub}
                className={`block text-sm mb-2 px-2 py-1 rounded cursor-pointer ${
                  subCategory === sub ? 'bg-[#fbe3cb] text-[#7a3e3e]' : 'text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="subCategory"
                  value={sub}
                  checked={subCategory === sub}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="mr-2 accent-[#c96e38]"
                />
                {sub || 'All'}
              </label>
            ))}
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-[#7a3e3e]">Sort by:</label>
            <select
              value={selectedSort}
              onChange={handledropChange}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#c96e38]"
            >
              <option value="">None</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="mostSelling">Most Selling</option>
            </select>
          </div>
        </motion.div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto px-25 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {feedPost?.length ? (
              feedPost.map((post) => (
                // ✅ Fix 4: key is post._id not index
                <motion.li
                  key={post._id}
                  whileHover={{ scale: 1.03 }}
                  className="list-none cursor-pointer transition duration-200"
                  onClick={() => differ(post._id)}
                >
                  <CollectionCard post={post} />
                </motion.li>
              ))
            ) : (
              <div className="text-center text-[#7a3e3e] text-lg col-span-full">
                No data found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
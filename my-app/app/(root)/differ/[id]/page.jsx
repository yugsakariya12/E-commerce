'use client';

import React, { useState, useEffect } from 'react';
import { useRouter ,useParams} from 'next/navigation';
import { CurrencyRupee, Star, ChatBubbleOutline, RateReview } from '@mui/icons-material';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Navbar from '@/app/components/Navbar';
import Loader from '@/app/components/Loader';
import CollectionCard from '@/app/components/CollectionCard';




const Page = () => {

  const params = useParams();
  const id = params.id;
  const [post, setPost] = useState({});
  const [size, setSize] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState('');
  const [feedPost, setFeedPost] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (post.category && post.subCategory) fetchRelated();
  }, [post]);

 const getUser = async () => {
    try {
      const res = await fetch(`/api/${id}`);
      const data = await res.json();
      if (data.success) {
        setPost(data.details);
        setMainImage(data.details.postPhotos?.[0]);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async () => {
    try {
      const res = await fetch('/api/catsubcat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: post.category, subCategory: post.subCategory }),
      });
      const data = await res.json();
      setFeedPost(data.result);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

const handleAddToCart = async () => {
  if (!size) return toast.error('Please select a size');

  const user = JSON.parse(localStorage.getItem('User')); // ✅ capital U
  const userId = user?._id;

  if (!userId) {
    toast.error('Please login first');
    router.push('/login');
    return;
  }

  const newItem = {
    _id: post._id,
    name: post.Name,
    price: post.Price,
    size,
    photo: post.postPhotos?.[0],
    cartId: `${post._id}_${size}_${Date.now()}`,
  };

  try {
    const res = await fetch('/api/cart', {
      headers: { 'user-id': userId },
    });
    const currentItems = await res.json();

    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        items: [...currentItems, newItem],
      }),
    });

    toast.success('Added to cart! 🛒');
  } catch (err) {
    toast.error('Failed to add to cart');
  }
};

  const submitReview = async () => {
    if (!reviewRating || !reviewMessage.trim()) {
      toast.error('Please provide a rating and message');
      return;
    }

    try {
      const res = await fetch(`/api/review/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, message: reviewMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setPost(data.updatedPost);
        setReviewRating(0);
        setReviewMessage('');
        toast.success('Review submitted');
      }
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  // FIX 1: Loader is now perfectly centred on the full screen
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f0]">
      <Loader />
    </div>
  );

  return (
    <div className="bg-[#fdf6f0] text-[#3c2a21] font-[Poppins]">
      <Toaster position="top-center" />
      <Navbar />

      <div className="flex flex-col md:flex-row gap-6 p-6 flex-wrap justify-center items-center">
        <div className="flex md:flex-col gap-2">
          {post?.postPhotos?.map((photo, index) => (
            <img
              key={index}
              src={photo}
              onClick={() => setMainImage(photo)}
              className="w-20 h-24 object-cover rounded-md cursor-pointer border hover:border-[#c96e38]"
            />
          ))}
        </div>

        <motion.div className="w-[300px] h-[400px]">
          <motion.img
            key={mainImage}
            src={mainImage}
            alt="Main Product"
            className="w-full h-full object-cover rounded-xl shadow-lg"
            initial={{ opacity: 0.5, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        <div className="flex flex-col gap-3 w-full max-w-md">
          <h2 className="text-2xl font-semibold">{post.Name}</h2>
          <div className="flex items-center gap-1 text-yellow-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={post.review?.length >= s ? 'text-yellow-500' : 'text-gray-400'} />
            ))}
            <span className="text-sm text-gray-600 ml-2">({post.review?.length || 0})</span>
          </div>
          <div className="text-3xl font-bold flex items-center gap-1">
            <CurrencyRupee fontSize="large" /> {post.Price}
          </div>
          <p className="text-sm text-gray-700">{post.Description}</p>

          <div>
            <span className="font-semibold">Select Size:</span>
            <div className="flex gap-3 mt-1 flex-wrap">
              {post?.Size?.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setSize(s)}
                  className={`px-3 py-1 rounded-lg border ${size === s ? 'bg-[#c96e38] text-white' : 'bg-white'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-4 bg-gray-800 text-white py-2 rounded-xl hover:bg-gray-700 transition"
          >
            Add to Cart
          </button>

          <ul className="text-sm mt-4 space-y-1 text-gray-600">
            <li>✓ 100% Original Product</li>
            <li>✓ Cash on delivery available</li>
            <li>✓ Easy return within 7 days</li>
          </ul>
        </div>
      </div>

      <div className="p-6 max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-[#7a3e3e]">
          <RateReview className="text-[#c96e38]" /> Write a Review
        </h3>
        <div className="flex gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              onClick={() => setReviewRating(s)}
              className={`cursor-pointer ${reviewRating >= s ? 'text-yellow-500' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <textarea
          value={reviewMessage}
          onChange={(e) => setReviewMessage(e.target.value)}
          placeholder="Your honest opinion..."
          className="w-full p-2 border border-[#eedfd2] rounded mb-2 text-black bg-[#fffaf5] shadow-sm"
        />
        <button
          onClick={submitReview}
          className="bg-[#c96e38] text-white px-4 py-2 rounded hover:bg-[#b55d2f] transition"
        >
          Submit Review
        </button>

        {post.reviewMessage?.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3 text-[#3c2a21]">Customer Reviews</h4>
            <ul className={`space-y-3 max-h-[300px] overflow-y-auto pr-2 ${post.reviewMessage.length > 5 ? 'scrollbar-thin scrollbar-thumb-[#e0c1a1] scrollbar-track-[#fdf6f0]' : ''}`}>
              {post.reviewMessage?.map((msg, i) => (
                <motion.li
                  key={i}
                  className="bg-[#fff8f1] p-4 rounded-xl border border-[#eedfd2] shadow-md flex items-start gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ChatBubbleOutline className="text-[#c96e38] mt-1" />
                  <div>
                    <div className="font-semibold text-[#c96e38]">{post.review?.[i]}★</div>
                    <div className="text-sm text-[#3c2a21]">{msg}</div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* FIX 2: Related products start from left, not centred */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-4">Related Products</h3>
        <div className="flex flex-wrap gap-4 justify-start">
          {feedPost
            .filter((item) => item._id !== post._id)
            .map((fpost, index) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => router.push('/differ/' + fpost._id)}
              >
                <CollectionCard post={fpost} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
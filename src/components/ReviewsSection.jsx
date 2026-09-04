'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, ThumbsUp, Upload, Image as ImageIcon, Video, X, CheckCircle2, MessageSquare, Plus, Loader2 } from 'lucide-react';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 5.0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [productName, setProductName] = useState('Galaxy Resin Keychain');
  const [comment, setComment] = useState('');
  const [mediaList, setMediaList] = useState([]); // [{ url, mediaType }]
  
  // Lightbox modal state for viewing photo/video enlarged
  const [activeMedia, setActiveMedia] = useState(null);

  const fileInputRef = useRef(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingFiles(true);

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (data.success && data.url) {
          const isVideo = file.type.startsWith('video');
          setMediaList(prev => [...prev, {
            url: data.url,
            mediaType: isVideo ? 'video' : 'image'
          }]);
        }
      } catch (err) {
        console.error('File upload error:', err);
      }
    }

    setUploadingFiles(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeMedia = (index) => {
    setMediaList(prev => prev.filter((_, i) => i !== index));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);
    setFeedbackMsg('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          rating,
          productName,
          comment,
          media: mediaList
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbackMsg('Thank you! Your review has been submitted successfully.');
        setName('');
        setEmail('');
        setComment('');
        setMediaList([]);
        setRating(5);
        fetchReviews();
        setTimeout(() => {
          setIsModalOpen(false);
          setFeedbackMsg('');
        }, 1500);
      } else {
        setFeedbackMsg(data.error || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      console.error('Submit review error:', err);
      setFeedbackMsg('Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-white border-t border-violet-100 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 text-violet-800 text-xs font-semibold uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 fill-violet-600 text-violet-600" /> Customer Reviews & Photos
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-violet-950 font-serif">
              Loved by 2,700+ Art Enthusiasts
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Real customer unboxing videos, photos, and feedback on their handmade resin orders.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="self-start md:self-auto px-6 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-2xl font-semibold text-sm shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Rating Scoreboard Banner */}
        <div className="bg-gradient-to-br from-violet-50/70 via-purple-50/40 to-pink-50/30 rounded-3xl p-6 sm:p-8 mb-12 border border-violet-100/80 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="flex items-center gap-5 text-center sm:text-left">
            <div className="text-5xl sm:text-6xl font-black text-violet-950 font-serif tracking-tight">
              {stats.averageRating || '5.0'}
            </div>
            <div>
              <div className="flex items-center gap-1 text-[#D4AF37] mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-800">
                Based on {stats.totalReviews || reviews.length} verified buyer reviews
              </p>
              <p className="text-xs text-gray-500">100% genuine handcrafted customer satisfaction</p>
            </div>
          </div>

          {/* Star bars */}
          <div className="w-full md:w-64 space-y-1.5 text-xs">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.breakdown?.[star] || 0;
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : (star === 5 ? 90 : 5);
              return (
                <div key={star} className="flex items-center gap-2 text-gray-600">
                  <span className="w-3 text-right font-medium">{star}</span>
                  <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                  <div className="flex-1 h-2 bg-gray-200/80 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-600 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="w-6 text-right text-gray-400 font-mono">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => {
            const hasMedia = rev.media && rev.media.length > 0;

            return (
              <div
                key={rev._id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-violet-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars & Verified Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rev.rating ? 'fill-[#D4AF37]' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>

                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Buyer
                      </span>
                    )}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                    "{rev.comment}"
                  </p>

                  {/* Customer Uploaded Photos & Videos */}
                  {hasMedia && (
                    <div className="flex flex-wrap gap-2.5 mb-4">
                      {rev.media.map((item, mIdx) => {
                        const isVid = item.mediaType === 'video';
                        return (
                          <div
                            key={mIdx}
                            onClick={() => setActiveMedia(item)}
                            className="relative w-16 h-16 rounded-xl overflow-hidden cursor-pointer border border-violet-200 hover:opacity-90 group transition bg-slate-900 flex-shrink-0"
                          >
                            {isVid ? (
                              <div className="w-full h-full flex items-center justify-center bg-violet-950 text-white">
                                <Video className="w-6 h-6 text-violet-300" />
                                <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 px-1 rounded text-white font-mono">Video</span>
                              </div>
                            ) : (
                              <img
                                src={item.url}
                                alt="Customer resin photo"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer details: Customer info & Product Tag */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{rev.name}</p>
                    <p className="text-violet-600 font-medium">{rev.productName}</p>
                  </div>
                  <span className="text-gray-400">
                    {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal for enlarged photo/video preview */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-slate-950 rounded-3xl overflow-hidden p-2 shadow-2xl border border-white/10">
            <button
              onClick={() => setActiveMedia(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center min-h-[300px] max-h-[75vh] overflow-hidden rounded-2xl">
              {activeMedia.mediaType === 'video' ? (
                <video src={activeMedia.url} controls autoPlay className="max-h-[70vh] w-full rounded-2xl" />
              ) : (
                <img src={activeMedia.url} alt="Enlarged review photo" className="max-h-[70vh] object-contain rounded-2xl" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-violet-100 my-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-violet-950 font-serif">Share Your Experience</h3>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Upload your resin photo or unboxing video to be featured on our site!
              </p>
            </div>

            {feedbackMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-violet-50 text-violet-800 text-xs font-semibold border border-violet-200">
                {feedbackMsg}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Overall Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (hoverRating || rating)
                            ? 'text-[#D4AF37] fill-[#D4AF37]'
                            : 'text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-gray-700 ml-2">{rating} out of 5 Stars</span>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Rao"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="ananya@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              </div>

              {/* Product Purchased */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Product Purchased
                </label>
                <select
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 bg-white"
                >
                  <option>Galaxy Resin Keychain</option>
                  <option>Floral Resin Photo Frame</option>
                  <option>Custom Name Nameplate</option>
                  <option>Rose Gold Resin Earrings</option>
                  <option>Ocean Wave Keychain</option>
                  <option>Pearl Resin Pendant</option>
                  <option>Diwali Special Diya Set</option>
                  <option>Custom Resin Art Piece</option>
                  <option>Other Creation</option>
                </select>
              </div>

              {/* Review Comments */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Review & Feedback *
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="How was the resin finish, colors, customization, and packaging?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                ></textarea>
              </div>

              {/* Photo / Video Upload Section */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Upload Photos or Videos (Optional)</span>
                  <span className="text-[11px] text-gray-400 font-normal">PNG, JPG, MP4</span>
                </label>

                <div className="flex flex-wrap gap-2 mb-3">
                  {mediaList.map((item, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-violet-200 group bg-slate-100 flex-shrink-0">
                      {item.mediaType === 'video' ? (
                        <div className="w-full h-full flex items-center justify-center bg-violet-900 text-white">
                          <Video className="w-5 h-5" />
                        </div>
                      ) : (
                        <img src={item.url} alt="Uploaded item" className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(idx)}
                        className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    disabled={uploadingFiles}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 rounded-xl border-2 border-dashed border-violet-300 hover:border-violet-500 flex flex-col items-center justify-center text-violet-600 text-[10px] font-medium hover:bg-violet-50 transition cursor-pointer"
                  >
                    {uploadingFiles ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mb-0.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || uploadingFiles}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Review...</span>
                  </>
                ) : (
                  <span>Submit My Review</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}


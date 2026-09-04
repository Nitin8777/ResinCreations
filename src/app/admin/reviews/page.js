'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  Search, 
  Filter, 
  Trash2, 
  PlusCircle, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  X, 
  Loader2, 
  Upload, 
  Image as ImageIcon, 
  MessageSquareQuote,
  ThumbsUp
} from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 5.0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReviewIds, setSelectedReviewIds] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    email: '',
    rating: 5,
    productName: 'Galaxy Resin Keychain',
    comment: '',
    status: 'approved',
    mediaUrl: ''
  });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let url = '/api/reviews?admin=true';
      if (statusFilter !== 'All') url += `&status=${statusFilter}`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        if (data.stats) setStats(data.stats);
      }
      setSelectedReviewIds([]);
    } catch (err) {
      console.error('Error fetching admin reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  // Client-side search filtering
  const filteredReviews = useMemo(() => {
    if (!searchTerm.trim()) return reviews;
    const term = searchTerm.toLowerCase();
    return reviews.filter(r => 
      (r.name && r.name.toLowerCase().includes(term)) ||
      (r.productName && r.productName.toLowerCase().includes(term)) ||
      (r.comment && r.comment.toLowerCase().includes(term))
    );
  }, [reviews, searchTerm]);

  // Multi-select
  const handleSelectAll = () => {
    if (selectedReviewIds.length === filteredReviews.length) {
      setSelectedReviewIds([]);
    } else {
      setSelectedReviewIds(filteredReviews.map(r => r._id));
    }
  };

  const toggleSelectReview = (id) => {
    setSelectedReviewIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Status Change (Approve, Reject, Pending)
  const handleStatusChange = async (id, newStatus) => {
    setStatusUpdatingId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
        // Update stats
        fetchReviews();
      } else {
        alert(data.error || 'Failed to update review status');
      }
    } catch (err) {
      console.error('Status update error:', err);
      alert('Error updating review status');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Delete Single Review
  const handleDeleteReview = async (id, reviewerName) => {
    if (!window.confirm(`Are you sure you want to delete the review by "${reviewerName}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews(prev => prev.filter(r => r._id !== id));
        setSelectedReviewIds(prev => prev.filter(item => item !== id));
        alert('Review deleted successfully.');
      } else {
        alert(data.error || 'Failed to delete review');
      }
    } catch (err) {
      console.error('Delete review error:', err);
      alert('Error deleting review');
    } finally {
      setDeletingId(null);
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedReviewIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedReviewIds.length} selected reviews?`)) {
      return;
    }

    setBulkDeleting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedReviewIds })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews(prev => prev.filter(r => !selectedReviewIds.includes(r._id)));
        setSelectedReviewIds([]);
        alert(`${data.deletedCount || selectedReviewIds.length} reviews deleted successfully.`);
      } else {
        alert(data.error || 'Failed to delete reviews');
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
      alert('Error during bulk deletion');
    } finally {
      setBulkDeleting(false);
    }
  };

  // Image upload in Add Modal
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setNewReview(prev => ({ ...prev, mediaUrl: data.url }));
      } else {
        alert(data.error || 'Failed to upload photo');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit New Review
  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      alert('Customer Name and Review Comment are required.');
      return;
    }

    setSubmitting(true);
    try {
      const media = newReview.mediaUrl ? [{ url: newReview.mediaUrl, mediaType: 'image' }] : [];
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newReview,
          media
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('New review created successfully!');
        setIsAddModalOpen(false);
        setNewReview({
          name: '',
          email: '',
          rating: 5,
          productName: 'Galaxy Resin Keychain',
          comment: '',
          status: 'approved',
          mediaUrl: ''
        });
        fetchReviews();
      } else {
        alert(data.error || 'Failed to create review');
      }
    } catch (err) {
      console.error('Create review error:', err);
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquareQuote className="w-7 h-7 text-violet-600" />
            Customer Reviews & Testimonials
          </h1>
          <p className="text-xs text-gray-500 mt-1">Manage ratings, approve testimonials, or add customer reviews to display on the storefront.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Review</span>
          </button>
          <button 
            type="button"
            onClick={fetchReviews}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3.5 py-2 rounded-xl hover:bg-gray-50 transition-colors text-xs font-semibold shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-violet-100 shadow-sm">
          <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider mb-1">Total Reviews</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-violet-950">{stats.totalReviews}</span>
            <span className="text-xs text-emerald-600 font-medium">Customer feedback</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-violet-100 shadow-sm">
          <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider mb-1">Average Rating</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-[#D4AF37]">{stats.averageRating || '5.0'}</span>
            <div className="flex text-[#D4AF37]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-violet-100 shadow-sm">
          <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider mb-1">Approved & Live</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">{stats.approvedCount}</span>
            <span className="text-xs text-gray-500">Visible on site</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-violet-100 shadow-sm">
          <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider mb-1">Pending / Review</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">{stats.pendingCount}</span>
            <span className="text-xs text-gray-500">Needs approval</span>
          </div>
        </div>
      </div>

      {/* Bulk Action Banner */}
      {selectedReviewIds.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-sm font-bold text-rose-900">
              {selectedReviewIds.length} review{selectedReviewIds.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedReviewIds([])}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Deselect All
            </button>
            <button
              type="button"
              disabled={bulkDeleting}
              onClick={handleBulkDelete}
              className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {bulkDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, product, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 text-xs sm:text-sm outline-none bg-gray-50/60"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl">
            {['All', 'approved', 'pending', 'rejected'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                  statusFilter === st 
                    ? 'bg-white text-violet-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {st === 'All' ? 'All Reviews' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Table View (Desktop) */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 uppercase text-[11px] font-bold tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredReviews.length > 0 && selectedReviewIds.length === filteredReviews.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-3.5">Customer & Product</th>
                <th className="px-6 py-3.5">Rating</th>
                <th className="px-6 py-3.5">Review Comment</th>
                <th className="px-6 py-3.5">Media</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin text-violet-600 mx-auto mb-2" />
                    <span>Loading reviews...</span>
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <MessageSquareQuote className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-bold text-gray-700">No reviews found</p>
                    <p className="text-xs text-gray-400 mt-1">Try changing filters or add your first customer review.</p>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => {
                  const isSelected = selectedReviewIds.includes(rev._id);
                  return (
                    <tr 
                      key={rev._id}
                      className={`hover:bg-gray-50/60 transition-colors ${isSelected ? 'bg-violet-50/40' : ''}`}
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectReview(rev._id)}
                          className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-gray-300 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          <span>{rev.name}</span>
                          {rev.verified && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-bold border border-emerald-200">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-violet-700 font-medium mt-0.5">{rev.productName}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-200'}`} 
                            />
                          ))}
                          <span className="text-xs font-bold text-gray-700 ml-1">({rev.rating})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed">
                          "{rev.comment}"
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {rev.media && rev.media.length > 0 ? (
                          <div className="flex gap-1.5">
                            {rev.media.slice(0, 2).map((m, idx) => (
                              <a 
                                key={idx} 
                                href={m.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 block"
                              >
                                <img src={m.url} alt="Review attachment" className="w-full h-full object-cover" />
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No media</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={rev.status || 'approved'}
                          disabled={statusUpdatingId === rev._id}
                          onChange={(e) => handleStatusChange(rev._id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer ${
                            rev.status === 'approved' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : rev.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          disabled={deletingId === rev._id}
                          onClick={() => handleDeleteReview(rev._id, rev.name)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition border border-rose-200 disabled:opacity-50 cursor-pointer shadow-sm"
                          title="Delete Review"
                        >
                          {deletingId === rev._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          )}
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin text-violet-600 mx-auto mb-2" />
              <span>Loading reviews...</span>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="font-bold text-gray-700">No reviews found</p>
            </div>
          ) : (
            filteredReviews.map((rev) => {
              const isSelected = selectedReviewIds.includes(rev._id);
              return (
                <div key={rev._id} className={`p-4 space-y-3 ${isSelected ? 'bg-violet-50/40' : 'bg-white'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectReview(rev._id)}
                        className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-gray-300 cursor-pointer"
                      />
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{rev.name}</div>
                        <div className="text-xs text-violet-700">{rev.productName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-[#D4AF37]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3 h-3 ${star <= rev.rating ? 'fill-current' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100 italic">
                    "{rev.comment}"
                  </p>

                  {rev.media && rev.media.length > 0 && (
                    <div className="flex gap-2">
                      {rev.media.map((m, idx) => (
                        <img key={idx} src={m.url} alt="Review attachment" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 gap-2">
                    <select
                      value={rev.status || 'approved'}
                      onChange={(e) => handleStatusChange(rev._id, e.target.value)}
                      className="text-xs font-bold rounded-lg px-2.5 py-1.5 bg-gray-100 border border-gray-200"
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <button
                      type="button"
                      disabled={deletingId === rev._id}
                      onClick={() => handleDeleteReview(rev._id, rev.name)}
                      className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-violet-100 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 font-serif mb-1">Add Customer Review</h3>
            <p className="text-xs text-gray-500 mb-6">Manually record a customer testimonial or WhatsApp feedback to show on your store.</p>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newReview.name}
                  onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Purchased</label>
                <input
                  type="text"
                  placeholder="e.g. Galaxy Resin Keychain"
                  value={newReview.productName}
                  onChange={(e) => setNewReview(prev => ({ ...prev, productName: e.target.value }))}
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Star Rating</label>
                <div className="flex items-center gap-1 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star 
                        className={`w-6 h-6 ${star <= newReview.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-200'}`} 
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-[#D4AF37] ml-2">{newReview.rating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Review Comment / Testimonial *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write the customer's feedback or testimonial here..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                />
              </div>

              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Photo Attachment (Optional)</label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      disabled={uploadingImage}
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                  <span className="text-xs text-gray-400">or enter URL:</span>
                </div>
                <input
                  type="url"
                  placeholder="https://... or /images/sample.jpg"
                  value={newReview.mediaUrl}
                  onChange={(e) => setNewReview(prev => ({ ...prev, mediaUrl: e.target.value }))}
                  className="w-full mt-2 px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                />
                {newReview.mediaUrl && (
                  <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-gray-200 relative group">
                    <img src={newReview.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, mediaUrl: '' }))}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 shadow hover:scale-110"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Publication Status</label>
                <select
                  value={newReview.status}
                  onChange={(e) => setNewReview(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none bg-gray-50/50 font-medium"
                >
                  <option value="approved">Approved (Live on website immediately)</option>
                  <option value="pending">Pending Review</option>
                  <option value="rejected">Rejected / Hidden</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


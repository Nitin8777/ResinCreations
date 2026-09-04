'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  IndianRupee, 
  Clock, 
  ArrowRight, 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Loader2,
  RefreshCw,
  Star,
  MessageSquareQuote
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
    totalReviews: 0,
    averageRating: 5.0
  });
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ totalReviews: 0, averageRating: 5.0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [statusUpdatingReviewId, setStatusUpdatingReviewId] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const categories = [
    { label: 'All Categories', value: 'All' },
    { label: 'Resin Keychains', value: 'resin-keychains' },
    { label: 'Resin Jewelry', value: 'resin-jewelry' },
    { label: 'Resin Photo Frames', value: 'resin-photo-frames' },
    { label: 'Resin Nameplates', value: 'resin-nameplates' },
    { label: 'Custom Items', value: 'custom-items' },
    { label: 'Festival Special', value: 'festival-special' }
  ];

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes, reviewsRes] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/orders?limit=10'),
        fetch('/api/reviews?admin=true')
      ]);
      
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const reviewsData = await reviewsRes.json();
      
      const allProducts = productsData.products || [];
      const allOrders = ordersData.orders || [];
      const allReviews = reviewsData.reviews || [];

      const pending = allOrders.filter(o => o.status === 'pending').length;
      const rev = allOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

      setStats({
        totalProducts: productsData.total || allProducts.length,
        totalOrders: ordersData.total || allOrders.length,
        revenue: rev,
        pendingOrders: pending,
        totalReviews: reviewsData.stats?.totalReviews || allReviews.length,
        averageRating: reviewsData.stats?.averageRating || 5.0
      });
      
      setProducts(allProducts);
      setRecentOrders(allOrders);
      setReviews(allReviews);
      if (reviewsData.stats) setReviewStats(reviewsData.stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewStatusChange = async (id, newStatus) => {
    setStatusUpdatingReviewId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
      } else {
        alert(data.error || 'Failed to update review status');
      }
    } catch (err) {
      console.error('Error updating review status:', err);
    } finally {
      setStatusUpdatingReviewId(null);
    }
  };

  const handleDeleteReview = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the review by "${name}"?`)) return;
    setDeletingReviewId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews(prev => prev.filter(r => r._id !== id));
        setStats(prev => ({ ...prev, totalReviews: Math.max(0, prev.totalReviews - 1) }));
      } else {
        alert(data.error || 'Failed to delete review');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
    } finally {
      setDeletingReviewId(null);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(prev => prev.filter(p => p._id !== id));
        setStats(prev => ({
          ...prev,
          totalProducts: Math.max(0, prev.totalProducts - 1)
        }));
        alert(`"${name}" has been deleted successfully.`);
      } else {
        alert(data.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting product.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteOrder = async (orderId, orderNumber) => {
    if (!window.confirm(`Are you sure you want to delete Order #${orderNumber}?`)) return;
    setDeletingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setRecentOrders(prev => prev.filter(o => o._id !== orderId));
        setStats(prev => ({ ...prev, totalOrders: Math.max(0, prev.totalOrders - 1) }));
        alert(`Order #${orderNumber} has been deleted.`);
      } else {
        alert(data.error || 'Failed to delete order');
      }
    } catch (err) {
      console.error('Delete order error:', err);
      alert('Error deleting order.');
    } finally {
      setDeletingOrderId(null);
    }
  };

  const handleSeedDefaultProducts = async () => {
    if (!window.confirm('Do you want to load default handcrafted products into the database?')) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Default products loaded successfully!');
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to seed products');
      }
    } catch (err) {
      console.error('Seed error:', err);
      alert('Error seeding products.');
    } finally {
      setSeeding(false);
    }
  };

  // Filter products for the dashboard table
  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === 'All' || 
      product.category === categoryFilter || 
      product.category?.toLowerCase() === categoryFilter.toLowerCase();
    
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term || 
      product.name?.toLowerCase().includes(term) ||
      product.slug?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-500' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-violet-500' },
    { title: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee, color: 'bg-emerald-500' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'bg-amber-500' },
    { title: 'Customer Reviews', value: `${stats.totalReviews} (${stats.averageRating}★)`, icon: Star, color: 'bg-yellow-500' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
        <p className="text-gray-500 text-sm font-medium">Loading Dashboard Overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage products catalog, customer orders, and store inventory.</p>
        </div>
        <div className="flex flex-wrap gap-2.5 items-center">
          {products.length === 0 && (
            <button
              type="button"
              disabled={seeding}
              onClick={handleSeedDefaultProducts}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
            >
              <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Loading...' : 'Load Default Products'}</span>
            </button>
          )}
          <Link 
            href="/admin/products/new" 
            className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link 
            href="/admin/orders" 
            className="inline-flex items-center gap-1.5 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium transition shadow-sm"
          >
            <span>View Orders</span>
          </Link>
          <Link 
            href="/admin/reviews" 
            className="inline-flex items-center gap-1.5 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium transition shadow-sm"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Reviews</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center gap-4 hover:border-violet-100 transition">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} shadow-sm`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Products Management Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Products Section Header & Controls */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-gray-900">All Products Catalog</h2>
              <span className="bg-violet-100 text-violet-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-0.5">View, edit details, or delete resin art creations from your live store.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm outline-none bg-gray-50/50"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 text-sm outline-none bg-gray-50/50 text-gray-700"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <Link
              href="/admin/products/new"
              className="inline-flex items-center justify-center gap-1 bg-violet-600 hover:bg-violet-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add Product</span>
            </Link>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 uppercase text-[11px] font-bold tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Inventory</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-3">
                        <Package className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-base mb-1">No products found</h3>
                      <p className="text-gray-500 text-xs mb-4">
                        {searchTerm || categoryFilter !== 'All' 
                          ? 'No products match your current search or category filter.' 
                          : 'Your store has no products yet. Add your first resin craft or load default products!'}
                      </p>
                      <div className="flex justify-center gap-2">
                        {searchTerm || categoryFilter !== 'All' ? (
                          <button
                            type="button"
                            onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium"
                          >
                            Clear Filters
                          </button>
                        ) : (
                          <>
                            <Link
                              href="/admin/products/new"
                              className="text-xs bg-violet-600 hover:bg-violet-700 text-white px-3.5 py-1.5 rounded-lg font-bold"
                            >
                              + Add New Product
                            </Link>
                            <button
                              type="button"
                              onClick={handleSeedDefaultProducts}
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg font-bold"
                            >
                              Load Default Products
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const imgUrl = typeof product.images?.[0] === 'string'
                    ? product.images[0]
                    : (product.images?.[0]?.url || '/images/placeholder.svg');

                  const catDisplay = (product.category || '')
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  return (
                    <tr key={product._id} className="hover:bg-violet-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200/80">
                            <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 leading-snug">{product.name}</p>
                            <p className="text-[11px] text-gray-400 font-mono">slug: {product.slug || product._id}</p>
                            {product.featured && (
                              <span className="inline-block mt-1 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">Featured</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">
                          {catDisplay}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {product.discountPrice ? (
                          <div>
                            <span className="font-bold text-gray-900 text-base">₹{product.discountPrice}</span>
                            <span className="text-xs text-gray-400 line-through ml-1.5">₹{product.price}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-gray-900 text-base">₹{product.price}</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {product.inStock ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" /> In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full text-xs font-semibold">
                            <XCircle className="w-3.5 h-3.5" /> Out of Stock
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Button */}
                          <Link 
                            href={`/admin/products/${product._id}/edit`}
                            className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors border border-violet-100"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Delete Button */}
                          <button 
                            type="button"
                            disabled={deletingId === product._id}
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100 disabled:opacity-50 cursor-pointer"
                            title="Delete Product"
                          >
                            {deletingId === product._id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Customer Orders</h2>
            <p className="text-gray-500 text-xs">Latest transactions and orders received through website checkout.</p>
          </div>
          <Link href="/admin/orders" className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1 font-semibold">
            View All Orders <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 uppercase text-[11px] font-bold tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Order #</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total Amount</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 text-sm">
                    No customer orders yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-violet-950">#{order.orderNumber}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.customerName}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        order.paymentStatus === 'paid' || order.status === 'completed' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : order.status === 'pending' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {order.paymentStatus === 'paid' ? 'Paid' : (order.status || 'Pending')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{order.totalAmount}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href="/admin/orders"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition border border-violet-200"
                          title="View in Orders"
                        >
                          <span>View</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <button
                          type="button"
                          disabled={deletingOrderId === order._id}
                          onClick={() => handleDeleteOrder(order._id, order.orderNumber)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition border border-rose-200 disabled:opacity-50 cursor-pointer shadow-sm"
                          title="Delete Order"
                        >
                          {deletingOrderId === order._id ? (
                            <Loader2 className="w-3 h-3 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="w-3 h-3 text-rose-600" />
                          )}
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Reviews Management Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-violet-600" />
              <span>Customer Reviews & Testimonials</span>
            </h2>
            <p className="text-gray-500 text-xs">Manage ratings, approve testimonials, or remove reviews directly from your dashboard.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/reviews"
              className="text-xs bg-violet-600 hover:bg-violet-700 text-white px-3.5 py-2 rounded-xl font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Manage All Reviews</span>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 uppercase text-[11px] font-bold tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Customer & Product</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Review Feedback</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">
                    No customer reviews yet.
                  </td>
                </tr>
              ) : (
                reviews.slice(0, 5).map((rev) => (
                  <tr key={rev._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 flex items-center gap-1.5">
                        <span>{rev.name}</span>
                        {rev.verified && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-violet-700 font-medium">{rev.productName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-0.5 text-[#D4AF37]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-gray-200'}`} />
                        ))}
                        <span className="text-xs font-bold text-gray-600 ml-1">({rev.rating})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-sm">
                      <p className="text-xs text-gray-600 line-clamp-2 italic">
                        "{rev.comment}"
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={rev.status || 'approved'}
                        disabled={statusUpdatingReviewId === rev._id}
                        onChange={(e) => handleReviewStatusChange(rev._id, e.target.value)}
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
                        disabled={deletingReviewId === rev._id}
                        onClick={() => handleDeleteReview(rev._id, rev.name)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition border border-rose-200 disabled:opacity-50 cursor-pointer shadow-sm"
                        title="Delete Review"
                      >
                        {deletingReviewId === rev._id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-rose-600" />
                        ) : (
                          <Trash2 className="w-3 h-3 text-rose-600" />
                        )}
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products?limit=50';
      if (categoryFilter !== 'All') {
        url += `&category=${encodeURIComponent(categoryFilter)}`;
      }
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, searchTerm]); // Consider adding debounce for searchTerm in real app

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition-colors text-sm font-medium w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 text-sm"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 text-sm"
          >
            <option value="All">All Categories</option>
            <option value="resin-keychains">Resin Keychains</option>
            <option value="resin-jewelry">Resin Jewelry</option>
            <option value="resin-photo-frames">Resin Photo Frames</option>
            <option value="resin-nameplates">Resin Nameplates</option>
            <option value="custom-items">Custom Items</option>
            <option value="festival-special">Festival Special</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const imgUrl = typeof product.images?.[0] === 'string'
                    ? product.images[0]
                    : (product.images?.[0]?.url || '/images/placeholder.svg');

                  const catDisplay = (product.category || '')
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  return (
                    <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                            <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-400 font-mono">/{product.slug || product._id}</p>
                            {product.featured && (
                              <span className="inline-block mt-0.5 text-[10px] bg-violet-100 text-violet-800 px-1.5 py-0.5 rounded font-medium">Featured</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">{catDisplay}</td>
                      <td className="px-6 py-4">
                        {product.discountPrice ? (
                          <div>
                            <span className="font-bold text-gray-900">₹{product.discountPrice}</span>
                            <span className="text-xs text-gray-400 line-through ml-1.5">₹{product.price}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-gray-900">₹{product.price}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {product.inStock ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-semibold">
                            <CheckCircle className="w-3 h-3" /> In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full text-xs font-semibold">
                            <XCircle className="w-3 h-3" /> Out of Stock
                          </span>
                        )}
                      </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/products/${product._id}/edit`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


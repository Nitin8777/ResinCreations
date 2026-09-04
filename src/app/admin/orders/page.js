'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Eye, 
  Filter, 
  Link as LinkIcon, 
  RefreshCcw, 
  Trash2, 
  X, 
  Loader2, 
  MessageCircle,
  AlertCircle
} from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [generatingLink, setGeneratingLink] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/api/orders?limit=100';
      if (statusFilter !== 'All') url += `&status=${statusFilter}`;
      if (paymentFilter !== 'All') url += `&paymentStatus=${paymentFilter}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data.orders || []);
      setSelectedOrderIds([]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentFilter]);

  // Client-side search filter
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter(o => 
      (o.orderNumber && o.orderNumber.toLowerCase().includes(term)) ||
      (o.customerName && o.customerName.toLowerCase().includes(term)) ||
      (o.customerPhone && o.customerPhone.toLowerCase().includes(term)) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(term))
    );
  }, [orders, searchTerm]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o._id));
    }
  };

  const toggleSelectOrder = (id) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handlePaymentStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newStatus })
      });
      
      if (res.ok) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, paymentStatus: newStatus } : o));
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status');
    }
  };

  const generatePaymentLink = async (order) => {
    setGeneratingLink(order._id);
    try {
      const res = await fetch('/api/razorpay/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order._id,
          amount: order.totalAmount,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          description: `Order ${order.orderNumber} - New Khushi Resin Creations`
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setOrders(orders.map(o => o._id === order._id ? { ...o, paymentLink: data.paymentLink } : o));
        if (navigator.clipboard) {
          navigator.clipboard.writeText(data.paymentLink);
        }
        alert('Payment link generated and copied to clipboard!\n\n' + data.paymentLink);
      } else {
        alert('Failed to generate payment link: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating link:', error);
      alert('An error occurred while generating payment link.');
    } finally {
      setGeneratingLink(null);
    }
  };

  // Single Order Delete
  const handleDeleteOrder = async (orderId, orderNumber) => {
    if (!window.confirm(`Are you sure you want to delete Order #${orderNumber}? This will permanently remove it from the database.`)) {
      return;
    }

    setDeletingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(prev => prev.filter(o => o._id !== orderId));
        setSelectedOrderIds(prev => prev.filter(id => id !== orderId));
        if (selectedOrder?._id === orderId) setSelectedOrder(null);
        alert(`Order #${orderNumber} deleted successfully.`);
      } else {
        alert(data.error || 'Failed to delete order.');
      }
    } catch (err) {
      console.error('Delete order error:', err);
      alert('An error occurred while deleting the order.');
    } finally {
      setDeletingId(null);
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedOrderIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to permanently delete ${selectedOrderIds.length} selected orders?`)) {
      return;
    }

    setBulkDeleting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedOrderIds })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(prev => prev.filter(o => !selectedOrderIds.includes(o._id)));
        setSelectedOrderIds([]);
        alert(`${data.deletedCount || selectedOrderIds.length} orders deleted successfully.`);
      } else {
        alert(data.error || 'Failed to delete selected orders.');
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
      alert('An error occurred during bulk deletion.');
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Orders</h1>
          <p className="text-xs text-gray-500 mt-1">Manage orders, update statuses, send payment links, or delete records.</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedOrderIds.length > 0 && (
            <button 
              type="button"
              disabled={bulkDeleting}
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {bulkDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              <span>Delete Selected ({selectedOrderIds.length})</span>
            </button>
          )}
          <button 
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3.5 py-2 rounded-lg hover:bg-gray-50 transition-colors text-xs font-semibold shadow-sm"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Floating / Sticky Bulk Action Banner */}
      {selectedOrderIds.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-sm font-bold text-rose-900">
              {selectedOrderIds.length} order{selectedOrderIds.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedOrderIds([])}
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
              <span>Confirm & Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order #, customer name, phone, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 text-xs sm:text-sm outline-none bg-gray-50/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 text-xs sm:text-sm outline-none bg-gray-50/60 text-gray-700"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 text-xs sm:text-sm outline-none bg-gray-50/60 text-gray-700"
            >
              <option value="All">All Payment Statuses</option>
              <option value="pending">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-gray-300 cursor-pointer"
                    title="Select All"
                  />
                </th>
                <th className="px-6 py-3">Order # / Date</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Total / Items</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Order Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
                      <span>Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                    <div className="max-w-xs mx-auto text-center">
                      <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="font-semibold text-gray-700 text-sm">No orders found</p>
                      <p className="text-xs text-gray-400 mt-0.5">Try clearing filters or search term.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order._id);
                  return (
                    <tr 
                      key={order._id} 
                      className={`hover:bg-gray-50/70 transition-colors ${isSelected ? 'bg-violet-50/40' : ''}`}
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOrder(order._id)}
                          className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-gray-300 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-violet-950">#{order.orderNumber}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerPhone}</div>
                        {order.customerEmail && <div className="text-xs text-gray-400 truncate max-w-[160px]">{order.customerEmail}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">₹{order.totalAmount}</div>
                        <div className="text-xs text-gray-500">{order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}</div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={order.paymentStatus || 'pending'} 
                          onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                          className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 ${
                            order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                            order.paymentStatus === 'failed' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                        </select>
                        
                        {order.paymentStatus !== 'paid' && (
                          <div className="mt-1.5">
                            {order.paymentLink ? (
                              <a 
                                href={order.paymentLink} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[11px] flex items-center gap-1 text-blue-600 hover:underline font-medium"
                              >
                                <LinkIcon className="w-3 h-3" /> View Link
                              </a>
                            ) : (
                              <button
                                onClick={() => generatePaymentLink(order)}
                                disabled={generatingLink === order._id}
                                className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium transition disabled:opacity-50"
                              >
                                {generatingLink === order._id ? 'Generating...' : '+ Link'}
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={order.status || 'pending'} 
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 ${
                            order.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Details Button */}
                          <button 
                            type="button"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition border border-violet-200"
                            title="View Full Order Details"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {/* Delete Order Button */}
                          <button
                            type="button"
                            disabled={deletingId === order._id}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition border border-rose-200 disabled:opacity-50 cursor-pointer shadow-sm"
                            title="Delete this Order"
                            onClick={() => handleDeleteOrder(order._id, order.orderNumber)}
                          >
                            {deletingId === order._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            )}
                            <span>Delete</span>
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

        {/* Mobile Cards View (displayed on mobile screens) */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin text-violet-600 mx-auto mb-2" />
              <span>Loading orders...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-semibold text-gray-700 text-sm">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isSelected = selectedOrderIds.includes(order._id);
              return (
                <div 
                  key={order._id} 
                  className={`p-4 space-y-3 ${isSelected ? 'bg-violet-50/40' : 'bg-white'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOrder(order._id)}
                        className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-gray-300 cursor-pointer mt-0.5"
                      />
                      <div>
                        <span className="font-mono font-bold text-violet-950 block">#{order.orderNumber}</span>
                        <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-base text-gray-900 block">₹{order.totalAmount}</span>
                      <span className="text-xs text-gray-500">{order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-2.5 text-xs text-gray-700 space-y-1">
                    <p className="font-bold text-gray-900">{order.customerName}</p>
                    <p className="text-gray-500">{order.customerPhone}</p>
                  </div>

                  {/* Status Badges & Controls */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1">
                      <label className="text-[10px] text-gray-400 block mb-0.5 uppercase font-bold">Payment</label>
                      <select 
                        value={order.paymentStatus || 'pending'} 
                        onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                        className="w-full text-xs font-semibold rounded-lg px-2 py-1 bg-gray-100 border border-gray-200"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] text-gray-400 block mb-0.5 uppercase font-bold">Status</label>
                      <select 
                        value={order.status || 'pending'} 
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="w-full text-xs font-semibold rounded-lg px-2 py-1 bg-gray-100 border border-gray-200"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions for Mobile */}
                  <div className="flex items-center gap-2 pt-2">
                    <button 
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-lg text-xs font-bold border border-violet-200 flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === order._id}
                      onClick={() => handleDeleteOrder(order._id, order.orderNumber)}
                      className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                      {deletingId === order._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      <span>Delete Order</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-violet-100 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-100 text-violet-800">
                Order #{selectedOrder.orderNumber}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                selectedOrder.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {selectedOrder.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 font-serif mb-4">Customer & Order Details</h3>

            {/* Customer Info Card */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-5 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Customer Name:</span>
                <span className="font-semibold text-gray-900">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone Number:</span>
                <span className="font-mono font-medium">{selectedOrder.customerPhone || 'N/A'}</span>
              </div>
              {selectedOrder.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-mono">{selectedOrder.customerEmail}</span>
                </div>
              )}
              {selectedOrder.shippingAddress?.fullAddress && (
                <div className="border-t border-gray-200/60 pt-2 mt-2">
                  <span className="text-gray-500 block text-xs mb-0.5">Shipping Address:</span>
                  <span className="font-medium text-gray-900 leading-snug block">
                    {selectedOrder.shippingAddress.fullAddress}
                    {selectedOrder.shippingAddress.city ? `, ${selectedOrder.shippingAddress.city}` : ''}
                    {selectedOrder.shippingAddress.pincode ? ` - ${selectedOrder.shippingAddress.pincode}` : ''}
                  </span>
                </div>
              )}
              {selectedOrder.notes && (
                <div className="border-t border-gray-200/60 pt-2 mt-2 text-xs">
                  <span className="text-gray-500 block mb-0.5">Order Notes:</span>
                  <span className="font-medium text-gray-800 italic">"{selectedOrder.notes}"</span>
                </div>
              )}
            </div>

            {/* Items Card */}
            <div className="border border-gray-100 rounded-2xl p-4 mb-5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">Purchased Items</h4>
              <div className="space-y-3 divide-y divide-gray-50">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-start justify-between text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">{item.productName || item.name}</p>
                      <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                      {(item.customizations?.customText || item.customText) && (
                        <p className="text-xs text-violet-700 bg-violet-50 px-2 py-0.5 rounded mt-1 inline-block">
                          Custom: {item.customizations?.customText || item.customText}
                        </p>
                      )}
                    </div>
                    <div className="font-bold text-gray-900">₹{(item.price || 0) * (item.quantity || 1)}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-4 pt-3 flex justify-between items-center text-base font-extrabold text-gray-900">
                <span>Total Amount:</span>
                <span className="text-violet-900">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2.5">
              {selectedOrder.customerPhone && (
                <a
                  href={`https://wa.me/${selectedOrder.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${selectedOrder.customerName}, this is regarding your order #${selectedOrder.orderNumber} from New Khushi Resin Creations.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs shadow-sm transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Customer</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => handleDeleteOrder(selectedOrder._id, selectedOrder.orderNumber)}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete This Order</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

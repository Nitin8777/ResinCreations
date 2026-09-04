'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { Trash2, CreditCard, ShieldCheck, Truck, Loader2, ArrowLeft, CheckCircle2, AlertTriangle, MessageCircle, X, ExternalLink } from 'lucide-react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testModalData, setTestModalData] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [paymentSuccessModal, setPaymentSuccessModal] = useState(null);
  const [paymentErrorModal, setPaymentErrorModal] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSimulatePayment = async () => {
    if (!testModalData) return;
    setSimulating(true);
    try {
      const simulatedPaymentId = `pay_test_${Date.now()}`;
      const verifyRes = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: testModalData.order.id,
          razorpay_payment_id: simulatedPaymentId,
          razorpay_signature: 'simulated_signature',
          orderId: testModalData.createdOrder._id
        })
      });

      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.success) {
        const orderNum = testModalData.createdOrder.orderNumber;
        const paidAmount = total;
        const custName = customer.name || 'Valued Customer';
        clearCart();
        setTestModalData(null);
        setPaymentSuccessModal({
          orderNumber: orderNum,
          paymentId: simulatedPaymentId,
          amount: paidAmount,
          customerName: custName
        });
      } else {
        const orderNum = testModalData.createdOrder.orderNumber;
        setTestModalData(null);
        setPaymentErrorModal({
          title: 'Payment Verification Failed',
          message: verifyData.error || 'Server could not verify payment.',
          orderNumber: orderNum
        });
      }
    } catch (err) {
      console.error('Simulation error:', err);
      setTestModalData(null);
      setPaymentErrorModal({
        title: 'Payment Simulation Error',
        message: 'Something went wrong while processing test payment. Please try again.',
        orderNumber: testModalData.createdOrder?.orderNumber
      });
    } finally {
      setSimulating(false);
    }
  };

  const handleWhatsAppOrder = () => {
    let message = `*New Order from Website*\n\n`;
    cartItems.forEach((item, index) => {
      const price = item.price;
      message += `${index + 1}. *${item.name}* x ${item.quantity}\n`;
      if (item.customText) message += `   Customization: ${item.customText}\n`;
      message += `   Price: ₹${price * item.quantity}\n\n`;
    });
    message += `*Total: ₹${total}*\n`;
    if (customer.name) message += `*Customer Name:* ${customer.name}\n`;
    if (customer.phone) message += `*Phone:* ${customer.phone}\n`;
    if (customer.address) message += `*Address:* ${customer.address}, ${customer.city} ${customer.pincode}\n`;
    message += `\nPlease confirm my order.`;

    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleRazorpayPayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!customer.name.trim() || !customer.phone.trim()) {
      setError('Please enter your Name and Phone Number to proceed with payment.');
      return;
    }

    setLoading(true);

    try {
      // 1. Ensure Razorpay Checkout SDK is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Could not load Razorpay payment gateway. Please check your internet connection.');
      }

      // 2. Create the order in our backend
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customer.name,
          customerPhone: customer.phone,
          customerEmail: customer.email,
          items: cartItems.map(item => ({
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
            customizations: item.customizations || { customText: item.customText }
          })),
          totalAmount: total,
          shippingAddress: {
            fullAddress: customer.address,
            city: customer.city,
            pincode: customer.pincode
          },
          notes: customer.notes,
          orderSource: 'website'
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order) {
        throw new Error(orderData.error || 'Failed to initialize order on server');
      }

      const createdOrder = orderData.order;

      // 3. Create Razorpay order
      const rpRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          receipt: createdOrder.orderNumber,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          notes: { orderNumber: createdOrder.orderNumber }
        })
      });

      const rpData = await rpRes.json();
      if (!rpRes.ok || !rpData.order) {
        throw new Error(rpData.error || 'Failed to create Razorpay payment order');
      }

      const razorpayOrder = rpData.order;

      // If in demo/mock mode without live keys, show test simulation popup
      if (razorpayOrder.isMock) {
        setLoading(false);
        setTestModalData({
          order: razorpayOrder,
          createdOrder: createdOrder
        });
        return;
      }

      // 4. Configure Razorpay Options for Real Keys
      const options = {
        key: rpData.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'New Khushi Resin Creations',
        description: `Order #${createdOrder.orderNumber}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone
        },
        theme: {
          color: '#7C3AED'
        },
        handler: async function (response) {
          try {
            // 5. Verify payment signature on backend
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: createdOrder._id
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              clearCart();
              setLoading(false);
              setPaymentSuccessModal({
                orderNumber: createdOrder.orderNumber,
                paymentId: response.razorpay_payment_id,
                amount: total,
                customerName: customer.name || 'Valued Customer'
              });
            } else {
              setLoading(false);
              setPaymentErrorModal({
                title: 'Payment Verification Failed',
                message: verifyData.error || 'Payment was charged but signature could not be verified automatically. Contact support on WhatsApp with your payment ID.',
                orderNumber: createdOrder.orderNumber
              });
            }
          } catch (err) {
            console.error('Verification error:', err);
            setLoading(false);
            setPaymentErrorModal({
              title: 'Verification Incomplete',
              message: 'Payment was debited but signature verification had a network error. Contact support on WhatsApp with your payment ID.',
              orderNumber: createdOrder.orderNumber
            });
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setPaymentErrorModal({
              title: 'Payment Incomplete / Cancelled',
              message: 'You closed the Razorpay window before completing payment. No money was deducted.',
              orderNumber: createdOrder?.orderNumber
            });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setLoading(false);
        setPaymentErrorModal({
          title: 'Payment Failed',
          message: response.error?.description || response.error?.reason || 'Your payment was declined by the bank or gateway. Please try another card or UPI.',
          orderNumber: createdOrder?.orderNumber
        });
      });

      rzp.open();
    } catch (err) {
      console.error('Payment initialization error:', err);
      setError(err.message || 'Something went wrong while initiating payment.');
      setLoading(false);
      setPaymentErrorModal({
        title: 'Payment Initiation Error',
        message: err.message || 'Could not start payment gateway. Please verify your details or order via WhatsApp.',
        orderNumber: null
      });
    }
  };

  return (
    <div className="min-h-screen bg-violet-50/40 pb-24 pt-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-violet-950 font-serif">
              Shopping Cart {cartItems.length > 0 && `(${cartItems.length})`}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Review your handcrafted selections and checkout securely.</p>
          </div>
          <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-800">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-violet-100 max-w-lg mx-auto">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Explore our catalog of handmade resin keychains, jewelry, and frames.</p>
            <Link href="/products" className="inline-block px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition shadow-sm">
              Browse Creations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl shadow-sm border border-violet-100 overflow-hidden divide-y divide-gray-100">
                {cartItems.map((item, index) => {
                  const itemKey = `${item._id || item.productId}-${item.customText || index}`;
                  return (
                    <div key={itemKey} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-violet-50 flex-shrink-0 border border-violet-100/60">
                        <img
                          src={item.image || '/images/placeholder.svg'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.slug || item.productId}`} className="font-semibold text-gray-900 hover:text-violet-600 transition truncate block">
                          {item.name}
                        </Link>
                        <div className="text-violet-700 font-bold text-sm mt-0.5">₹{item.price} each</div>
                        {item.customText && (
                          <div className="text-xs text-violet-800 bg-violet-50 px-2.5 py-1 rounded-md mt-1.5 inline-block font-medium">
                            Customization: <span>{item.customText}</span>
                          </div>
                        )}
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-3 sm:mt-0">
                        <div className="flex items-center border border-gray-200 rounded-xl h-9 bg-gray-50/50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id || item.productId, item.customText, Math.max(1, item.quantity - 1))}
                            className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-200/50 rounded-l-xl transition font-medium"
                          >
                            -
                          </button>
                          <span className="w-9 text-center font-semibold text-sm text-gray-800">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id || item.productId, item.customText, item.quantity + 1)}
                            className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-200/50 rounded-r-xl transition font-medium"
                          >
                            +
                          </button>
                        </div>

                        <div className="font-bold text-gray-900 min-w-[70px] text-right">
                          ₹{item.price * item.quantity}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item._id || item.productId, item.customText)}
                          className="text-gray-400 hover:text-red-500 p-1.5 transition rounded-lg hover:bg-red-50"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery info notice */}
              <div className="bg-white rounded-2xl p-4 border border-violet-100 flex items-center gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-violet-600 flex-shrink-0" />
                <span>Handcrafted with precision. Dispatched within <strong>3-5 business days</strong>.</span>
              </div>
            </div>

            {/* Checkout & Summary Sidebar */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-violet-100 sticky top-8 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 font-serif">Customer & Delivery Details</h2>

                {error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleRazorpayPayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={customer.name}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="9876543210"
                        value={customer.phone}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="priya@gmail.com"
                        value={customer.email}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Flat, House no., Apartment, Street"
                      value={customer.address}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={customer.city}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        value={customer.pincode}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                      />
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-900">₹{total}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Standard Delivery</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total Amount</span>
                      <span className="text-2xl text-violet-700">₹{total}</span>
                    </div>
                  </div>

                  {/* Razorpay Pay Now Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-bold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Opening Razorpay...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>Pay ₹{total} with Razorpay</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Razorpay Trust Badges */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Secured by <strong>Razorpay</strong> • UPI, Cards, NetBanking, Wallets</span>
                </div>

                {/* Alternative WhatsApp order */}
                <div className="pt-2 border-t border-gray-100 text-center">
                  <span className="text-xs text-gray-400 block mb-3 uppercase tracking-wider font-semibold">Or order directly</span>
                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="w-full py-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl font-semibold transition text-sm flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">💬</span> Chat & Order on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Razorpay Test Simulation Modal */}
      {testModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-violet-100 relative animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
                  R
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Razorpay Checkout (Demo Mode)</h3>
                  <p className="text-[11px] text-gray-500 font-mono">Order #{testModalData.createdOrder.orderNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTestModalData(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-center mb-6 bg-violet-50/60 p-4 rounded-2xl border border-violet-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount to Pay</span>
              <div className="text-3xl font-extrabold text-violet-900 mt-0.5">₹{total}</div>
            </div>

            {/* Simulated Payment Methods */}
            <div className="space-y-2 mb-6">
              <div className="p-3.5 rounded-xl border border-violet-600 bg-violet-50/50 flex items-center justify-between text-xs font-semibold text-violet-950">
                <span className="flex items-center gap-2">📱 UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                <span className="w-2.5 h-2.5 rounded-full bg-violet-600 ring-2 ring-violet-200"></span>
              </div>
              <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 flex items-center justify-between text-xs text-gray-600 font-medium">
                <span className="flex items-center gap-2">💳 Cards (Visa, MasterCard, RuPay)</span>
              </div>
              <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 flex items-center justify-between text-xs text-gray-600 font-medium">
                <span className="flex items-center gap-2">🏦 NetBanking</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-800 mb-6 leading-relaxed">
              💡 <strong>Test Mode Active:</strong> Yeh simulator isliye dikh raha hai kyunki abhi <code>.env.local</code> mein real Razorpay API keys nahi dali hain. Jaise hi real keys dalenge, automatic official Razorpay popup khulega.
            </div>

            <button
              type="button"
              disabled={simulating}
              onClick={handleSimulatePayment}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-60"
            >
              {simulating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <span>Complete Payment (₹{total})</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Payment Success Modal */}
      {paymentSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative text-center">
            <button
              type="button"
              onClick={() => {
                setPaymentSuccessModal(null);
                router.push('/products');
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              Payment Successful ✨
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif mb-2">
              Order Confirmed! 🎉
            </h3>
            <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
              Thank you, <strong className="text-gray-900">{paymentSuccessModal.customerName}</strong>! Your order has been placed and our resin artisans will begin crafting your handmade pieces.
            </p>

            {/* Order Details Card */}
            <div className="bg-violet-50/60 rounded-2xl p-4 border border-violet-100 mb-6 text-left space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Order Number:</span>
                <span className="font-mono font-bold text-violet-950">#{paymentSuccessModal.orderNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Payment ID:</span>
                <span className="font-mono text-xs font-medium text-gray-700">{paymentSuccessModal.paymentId}</span>
              </div>
              <div className="flex items-center justify-between border-t border-violet-100/80 pt-2">
                <span className="font-medium text-gray-700">Amount Paid:</span>
                <span className="font-extrabold text-base text-emerald-600">₹{paymentSuccessModal.amount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href={`/order-success?orderNumber=${paymentSuccessModal.orderNumber}&paymentId=${paymentSuccessModal.paymentId}`}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <span>View Full Order Receipt & Status</span>
                <ExternalLink className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I just placed order #${paymentSuccessModal.orderNumber} (₹${paymentSuccessModal.amount}) on your website. Please share updates!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Track via WhatsApp Updates</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setPaymentSuccessModal(null);
                  router.push('/products');
                }}
                className="w-full py-2.5 text-gray-500 hover:text-gray-800 text-sm font-medium transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Error / Cancelled Modal */}
      {paymentErrorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-100 relative text-center">
            <button
              type="button"
              onClick={() => setPaymentErrorModal(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-4 text-rose-600 ring-8 ring-rose-50">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              Payment Not Completed
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif mb-2">
              {paymentErrorModal.title || 'Payment Failed'}
            </h3>
            <p className="text-gray-600 text-sm mb-5 leading-relaxed">
              {paymentErrorModal.message}
            </p>

            {paymentErrorModal.orderNumber && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 mb-5 text-xs text-gray-600">
                Order Reference: <strong className="font-mono text-gray-900">#{paymentErrorModal.orderNumber}</strong>
                <p className="text-[11px] text-gray-500 mt-0.5">Your cart items are safe and saved in your bag.</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setPaymentErrorModal(null)}
                className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Try Payment Again</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentErrorModal(null);
                  handleWhatsAppOrder();
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Complete Order on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentErrorModal(null)}
                className="w-full py-2 text-gray-400 hover:text-gray-600 text-xs font-medium transition cursor-pointer"
              >
                Close & Review Bag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

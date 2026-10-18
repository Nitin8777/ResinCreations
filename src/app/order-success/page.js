import Link from 'next/link';
import { CheckCircle2, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default async function OrderSuccessPage({ searchParams }) {
  const params = await searchParams;
  const orderNumber = params?.orderNumber || params?.orderId || 'KRC-CONFIRMED';
  const paymentId = params?.paymentId || params?.razorpay_payment_id || '';

  const whatsappMessage = `Hi! I have placed an order on your website. Order #: ${orderNumber}${paymentId ? `, Payment ID: ${paymentId}` : ''}. Could you please update me on the creation and dispatch status?`;

  return (
    <div className="min-h-screen bg-violet-50/50 dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-violet-100 dark:border-violet-900/40 p-8 sm:p-12 text-center">
        {/* Animated Check Icon */}
        <div className="w-20 h-20 bg-green-100 dark:bg-emerald-950/60 text-green-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-green-50 dark:ring-emerald-900/20">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-3">
          Payment Confirmed
        </span>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 font-serif">
          Thank You for Your Order!
        </h1>

        <p className="text-gray-600 dark:text-slate-300 mb-8 leading-relaxed text-sm sm:text-base">
          Your order has been received and confirmed. Our artisans at <strong className="text-gray-900 dark:text-white">New Khushi Resin Creations</strong> will begin handcrafting your unique resin piece with care.
        </p>

        {/* Order Details Card */}
        <div className="bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-6 text-left mb-8 border border-gray-100 dark:border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-slate-400">Order Reference</span>
            <span className="font-mono font-bold text-violet-900 dark:text-violet-300">{orderNumber}</span>
          </div>

          {paymentId && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-slate-400">Razorpay Payment ID</span>
              <span className="font-mono text-xs text-gray-700 dark:text-slate-300 bg-gray-200/70 dark:bg-slate-700 px-2 py-0.5 rounded">
                {paymentId}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200 dark:border-slate-700">
            <span className="text-gray-500 dark:text-slate-400">Payment Status</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Paid Online
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href={`https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-[#25D366] hover:bg-[#1ebd5c] text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            <MessageCircle className="w-5 h-5" />
            Track on WhatsApp
          </a>

          <Link
            href="/products"
            className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}


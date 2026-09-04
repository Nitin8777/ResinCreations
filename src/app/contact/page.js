'use client';

import { useState } from 'react';
import { Mail, Phone, MessageCircle, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

function InstagramIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: 'success',
          text: data.message || 'Thank you! Your message has been received. We will get back to you soon.'
        });
        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      } else {
        setStatus({
          type: 'error',
          text: data.error || 'Failed to send message. Please try again or reach out on WhatsApp.'
        });
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus({
        type: 'error',
        text: 'Network error. Please try again or chat with us on WhatsApp.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendViaWhatsApp = () => {
    let msg = `*Inquiry from Website Contact Form:*\n\n`;
    if (formData.name) msg += `*Name:* ${formData.name}\n`;
    if (formData.phone) msg += `*Phone:* ${formData.phone}\n`;
    if (formData.email) msg += `*Email:* ${formData.email}\n`;
    msg += `*Subject:* ${formData.subject}\n`;
    if (formData.message) msg += `*Message:* ${formData.message}\n`;
    else msg += `*Message:* Hi, I would like to inquire about your resin art products.`;

    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-violet-50/40 pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-700 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Get in Touch</h1>
        <p className="text-violet-100 max-w-2xl mx-auto text-base sm:text-lg">
          Have a question, bulk order, or custom resin art idea in mind? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-violet-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-violet-950 font-serif">Send us a Message</h2>
              <p className="text-gray-500 text-sm mt-1">Fill out the details below and we will get back to you promptly.</p>
            </div>

            {status.text && (
              <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm font-medium ${
                status.type === 'success' 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <span>{status.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Name *
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 outline-none transition text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="priya@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 outline-none transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 outline-none transition text-sm bg-white"
                >
                  <option>General Inquiry</option>
                  <option>Custom Resin Order</option>
                  <option>Bulk / Return Gift Order</option>
                  <option>Order Status Inquiry</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Message *
                </label>
                <textarea
                  required
                  rows="4"
                  name="message"
                  placeholder="Tell us what you're looking for, customization details, colors, etc..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 outline-none transition text-sm"
                ></textarea>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3.5 px-6 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendViaWhatsApp}
                  className="flex-1 bg-[#25D366] hover:bg-[#1ebd5c] text-white font-semibold py-3.5 px-6 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-violet-100">
              <h2 className="text-xl font-bold text-violet-950 mb-6 font-serif">Quick Contact</h2>
              
              <div className="space-y-4">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100 hover:bg-green-50/60 hover:border-green-200 transition group"
                >
                  <div className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mr-3.5 flex-shrink-0 group-hover:scale-105 transition">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">WhatsApp</p>
                    <p className="text-base font-semibold text-gray-900">+91 98765 43210</p>
                  </div>
                </a>

                <a
                  href="tel:+919876543210"
                  className="flex items-center p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100 hover:bg-violet-50/60 hover:border-violet-200 transition group"
                >
                  <div className="w-11 h-11 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mr-3.5 flex-shrink-0 group-hover:scale-105 transition">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Call Us</p>
                    <p className="text-base font-semibold text-gray-900">+91 98765 43210</p>
                  </div>
                </a>

                <a
                  href="mailto:newkhushiresincreations@gmail.com"
                  className="flex items-center p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100 hover:bg-blue-50/60 hover:border-blue-200 transition group"
                >
                  <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-3.5 flex-shrink-0 group-hover:scale-105 transition">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">newkhushiresincreations@gmail.com</p>
                  </div>
                </a>

                <a
                  href="https://instagram.com/newkhushiresincreations"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100 hover:bg-pink-50/60 hover:border-pink-200 transition group"
                >
                  <div className="w-11 h-11 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mr-3.5 flex-shrink-0 group-hover:scale-105 transition">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Instagram</p>
                    <p className="text-base font-semibold text-gray-900">@newkhushiresincreations</p>
                  </div>
                </a>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-violet-100">
              <h2 className="text-xl font-bold text-violet-950 mb-4 font-serif">Frequently Asked</h2>
              <div className="space-y-3">
                {[
                  { q: "How long does custom resin work take?", a: "Custom pieces typically take 5-7 days to cast and cure properly, plus 3-5 days for shipping." },
                  { q: "Can I customize color and name?", a: "Yes! Almost all creations can be personalized with names, photos, glitter, and color palettes." },
                  { q: "What payment options are available?", a: "We support direct Razorpay checkout (UPI, Cards, NetBanking) and WhatsApp payments." }
                ].map((faq, i) => (
                  <div key={i} className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{faq.q}</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  Heart,
  Truck,
} from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-violet-950 via-slate-900 to-indigo-950 text-white min-h-[640px] lg:min-h-[700px] flex items-center">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/30 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-semibold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Bespoke Resin Studio · 100% Handmade</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight leading-[1.15] text-white">
              Preserving Your{" "}
              <span className="bg-gradient-to-r from-amber-200 via-pink-200 to-violet-300 bg-clip-text text-transparent">
                Precious Moments
              </span>{" "}
              in Crystal-Clear Resin.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Hand-poured with real preserved botanicals, 24K gold foil flakes,
              and personalized details. From wedding keepsake photo frames to
              bespoke agate nameplates and sparkling jewelry.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/30 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <a
                href="https://wa.me/919876543210?text=Hi!%20I%20want%20to%20order%20a%20custom%20resin%20creation.%20Can%20you%20help%20me?"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all backdrop-blur-md hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 fill-current" />
                <span>Order Custom on WhatsApp</span>
              </a>
            </div>

            {/* Social Proof Strip */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs text-slate-300">
              <div className="flex items-center -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Customer"
                  className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="Customer"
                  className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="Customer"
                  className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
                />
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-slate-900">
                  +2.7k
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-white">4.9/5 Rating</span>
                <span className="text-slate-400">
                  · 2,700+ Delighted Customers
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered 3D Visual Art Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Main Showcase Frame */}
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 p-2 bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-md group">
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                <video autoPlay muted loop playsInline>
                  <source src="/images/video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Bottom caption inside photo */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                    Signature Creation
                  </p>
                  <p className="text-base font-bold text-white font-serif">
                    Gold-Leaf Floral Resin Agate
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Glass Badge 1 (Top Left) */}
            <div className="absolute -top-4 -left-4 sm:-left-6 backdrop-blur-md bg-white/15 border border-white/30 rounded-2xl p-3 sm:p-4 shadow-xl text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Custom Requests</p>
                <p className="text-[11px] text-amber-200">
                  Names, Dates & Photos
                </p>
              </div>
            </div>

            {/* Floating Glass Badge 2 (Bottom Right) */}
            <div className="absolute -bottom-5 -right-3 sm:-right-6 backdrop-blur-md bg-slate-900/80 border border-white/20 rounded-2xl p-3.5 sm:p-4 shadow-xl text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Real Flowers Preserved
                </p>
                <p className="text-[11px] text-emerald-300">
                  Non-yellowing crystal epoxy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row across bottom */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 mt-16 border-t border-white/10 text-center">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold font-serif text-white">
              2,700+
            </p>
            <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">
              Happy Customers
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold font-serif text-white">
              500+
            </p>
            <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">
              Custom Creational Designs
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold font-serif text-white">
              4.9 ★
            </p>
            <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">
              Customer Satisfaction
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold font-serif text-white">
              100%
            </p>
            <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">
              Handcrafted with Love
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

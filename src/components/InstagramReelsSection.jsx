'use client';

import { useState, useEffect } from 'react';
import { Play, Heart, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';

function InstagramLogo({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function InstagramReelsSection() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const fetchReels = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/instagram/reels');
      const data = await res.json();
      if (data.success && data.reels) {
        setReels(data.reels);
        setIsLive(data.isLive || false);
      }
    } catch (err) {
      console.error('Failed to fetch reels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white via-violet-50/40 to-white relative overflow-hidden">
      {/* Decorative resin background accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 border border-pink-200/60 mb-4">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-pink-700 flex items-center gap-1">
              <InstagramLogo className="w-3.5 h-3.5" /> Instagram Feed & Reels
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-violet-950 font-serif mb-3">
            Watch Our Creations Come to Life
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Behind the scenes, resin pouring, and unmolding videos directly from our workshop.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <a
              href="https://www.instagram.com/newkhushiresincreations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold text-sm shadow-md transition group"
            >
              <InstagramLogo className="w-4 h-4" />
              <span>Follow @newkhushiresincreations</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition" />
            </a>

            <span className="px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-700 shadow-sm">
              ✨ 2,700+ Followers • 337+ Posts
            </span>
          </div>
        </div>

        {/* Reels Grid (9:16 ratio) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {reels.map((reel, index) => {
            const thumbnail = reel.thumbnail_url || reel.media_url || '/images/placeholder.svg';
            const permalink = reel.permalink || 'https://www.instagram.com/newkhushiresincreations/';

            return (
              <a
                key={reel.id || index}
                href={permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[9/16] bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block border border-violet-100"
              >
                {/* Background Image / Thumbnail */}
                <img
                  src={thumbnail}
                  alt={reel.caption || 'Resin Art Reel'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />

                {/* Dark Vignette Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none"></div>

                {/* Top Bar: Reel Badge & Views */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-semibold text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span> Reel
                  </span>
                  {reel.views && (
                    <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-white/90">
                      👁️ {reel.views}
                    </span>
                  )}
                </div>

                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-pink-600/80 transition-all duration-300">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom Caption and CTA */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                  {reel.title && (
                    <p className="font-bold text-xs sm:text-sm mb-1 line-clamp-1 drop-shadow-sm text-pink-200">
                      {reel.title}
                    </p>
                  )}
                  <p className="text-[11px] sm:text-xs text-white/90 line-clamp-2 leading-snug drop-shadow-sm mb-2 font-normal">
                    {reel.caption}
                  </p>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-white/70 font-medium pt-1.5 border-t border-white/15">
                    <span className="flex items-center gap-1 group-hover:text-pink-300 transition">
                      <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                      <span>{reel.likes || 'Watch'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-white font-semibold group-hover:underline">
                      Watch Reel →
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Live Sync Notice Banner */}
        <div className="mt-10 p-4 rounded-2xl bg-white border border-violet-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700">
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              <strong>Auto-Sync Feature Active:</strong> Jaise hi aap Instagram pe nayi reel upload karenge, wo automatic aapki website par sync ho jayegi.
            </span>
          </div>
          <button
            onClick={fetchReels}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-semibold transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>
    </section>
  );
}


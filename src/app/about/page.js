import Link from 'next/link';
import {
  Sparkles,
  Palette,
  FlaskConical,
  PackageCheck,
  ShieldCheck,
  Gem,
  Heart,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 bg-gradient-to-b from-violet-950 via-slate-900 to-indigo-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Our Atelier Story</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif tracking-tight text-white mb-6">
            Crafting Memories That Never Fade
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to New Khushi Resin Creations — where fluid art, real botanical petals, and artisanal craftsmanship come together.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)]">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <h2 className="text-3xl font-bold text-gray-900 font-serif">The Heart Behind the Studio</h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              New Khushi Resin Creations began with a dream to capture fleeting beauty and preserve it for generations. What started at our home studio with a single bottle of epoxy resin and pressed garden flowers has grown into a cherished brand trusted by over 2,700+ art lovers across India.
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              Whether it’s preserving wedding varmalas, designing bespoke initial keychains, crafting gold-veined nameplates, or encapsulating precious milestones in floral frames, each creation is treated as a timeless work of art.
            </p>
          </div>
        </div>
      </section>

      {/* What is Resin Art? with real photography */}
      <section className="py-20 px-4 sm:px-6 bg-white border-y border-violet-100/60">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-wider">
              <Gem className="w-3.5 h-3.5" />
              <span>The Alchemy of Resin</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">
              What Makes Resin Art So Magical?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Resin art begins as a delicate two-part liquid formula: ultra-pure epoxy resin and hardener. Through patient, controlled pouring and curing over 48 to 72 hours, this liquid transforms into a glass-like solid surface with diamond-level shine.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Because resin cures through natural fluid dynamics, every single pour creates unique swirling currents that can never be replicated by a machine. Your piece is genuinely 1-of-1 in the entire world.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>UV Non-Yellowing</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Scratch-Resistant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Real Botanical Seal</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24K Gold Foil Veins</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-2 border-violet-100">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80"
              alt="Artisan Resin Fluid Process"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Handcrafted Atelier</p>
              <p className="text-sm font-semibold">Poured layer-by-layer with patience and love</p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Create: 4-Step Process */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Our Meticulous Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">How Each Piece Comes to Life</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              Icon: Palette,
              step: '01',
              title: 'Design & Vision',
              desc: 'We consult on your custom initial, floral preservation, or color theme.',
              color: 'from-violet-50 to-purple-100 text-violet-700'
            },
            {
              Icon: FlaskConical,
              step: '02',
              title: 'Precision Mixing',
              desc: 'High-clarity epoxy is blended with dried botanicals, mica, and gold leaf.',
              color: 'from-amber-50 to-orange-100 text-amber-700'
            },
            {
              Icon: Sparkles,
              step: '03',
              title: 'Curing & Polishing',
              desc: 'Cured over 72 hours in a dust-free chamber, then hand-buffed to glass shine.',
              color: 'from-pink-50 to-rose-100 text-rose-700'
            },
            {
              Icon: PackageCheck,
              step: '04',
              title: 'Safe Dispatch',
              desc: 'Packed in shockproof foam boxes and shipped safely anywhere in India.',
              color: 'from-teal-50 to-emerald-100 text-teal-700'
            }
          ].map((item, idx) => {
            const ItemIcon = item.Icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-xs`}>
                  <ItemIcon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-violet-600 tracking-wider uppercase mb-1">
                  Step {item.step}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">{item.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-violet-900 to-indigo-950 text-white rounded-3xl p-10 sm:p-14 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-4">
            Ready to Create Something Beautiful?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Explore our curated collections or chat with us directly on WhatsApp to craft your custom vision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="px-8 py-3.5 bg-white text-violet-950 font-bold text-sm rounded-full hover:bg-violet-50 transition-all shadow-md"
            >
              Browse Collections
            </Link>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-all shadow-md"
            >
              Order Custom Piece
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

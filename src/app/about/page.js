export default function AboutPage() {
  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-violet-100 via-violet-50 to-white text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-violet-900 mb-6 font-serif">About New Khushi Resin Creations</h1>
          <p className="text-lg text-violet-700">Crafting memories and beauty that last forever.</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-violet-900 mb-6 text-center font-serif">Our Story</h2>
        <div className="prose prose-violet mx-auto text-gray-700 text-lg leading-relaxed text-center">
          <p>
            New Khushi Resin Creations started from a deep passion for preserving beautiful moments and creating unique, one-of-a-kind art pieces. What began as a hobby of mixing resin and experimenting with colors soon blossomed into a beloved business dedicated to bringing joy to our customers through personalized, handmade crafts.
          </p>
        </div>
      </section>

      {/* What is Resin Art? */}
      <section className="py-16 px-4 md:px-8 bg-violet-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-violet-900 mb-4 font-serif">What is Resin Art?</h2>
            <p className="text-gray-700 mb-4">
              Resin art is created by mixing two components: a liquid resin and a hardener. When combined, a chemical reaction takes place, transforming the liquid into a solid, durable, and glossy plastic-like substance.
            </p>
            <p className="text-gray-700">
              This versatile medium allows us to encapsulate flowers, glitter, gold flakes, and create mesmerizing swirling color patterns that simply cannot be replicated, making every single piece entirely unique.
            </p>
          </div>
          <div className="flex-1 w-full aspect-square bg-violet-200 rounded-3xl shadow-lg relative overflow-hidden">
             {/* Decorative placeholder */}
             <div className="absolute inset-0 bg-gradient-to-tr from-violet-300 to-amber-200 opacity-60"></div>
          </div>
        </div>
      </section>

      {/* How We Create */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-violet-900 mb-12 text-center font-serif">How We Create</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: '🎨', title: '1. Design', desc: 'Customer shares their vision and preferences.' },
            { icon: '🧪', title: '2. Mix', desc: 'We carefully mix resin with colors & elements.' },
            { icon: '✨', title: '3. Create', desc: 'Pouring, setting, and curing with precision.' },
            { icon: '🎁', title: '4. Deliver', desc: 'Carefully packaged and delivered to you.' }
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-violet-100">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center text-3xl mb-4 text-violet-600">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-violet-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Resin Art? */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <h2 className="text-3xl font-bold text-violet-900 mb-10 text-center font-serif">Why Choose Resin Art?</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-violet-50 rounded-xl">
            <h3 className="font-bold text-violet-800 text-lg mb-2">💎 Highly Durable</h3>
            <p className="text-gray-700">Resin cures into a strong, scratch-resistant surface that lasts for years.</p>
          </div>
          <div className="p-6 bg-violet-50 rounded-xl">
            <h3 className="font-bold text-violet-800 text-lg mb-2">🌟 100% Unique</h3>
            <p className="text-gray-700">The fluid nature of resin means no two pours are ever exactly alike.</p>
          </div>
          <div className="p-6 bg-violet-50 rounded-xl">
            <h3 className="font-bold text-violet-800 text-lg mb-2">🎨 Fully Customizable</h3>
            <p className="text-gray-700">Add names, photos, flowers, or match any color scheme you desire.</p>
          </div>
          <div className="p-6 bg-violet-50 rounded-xl">
            <h3 className="font-bold text-violet-800 text-lg mb-2">♻️ Safe & Beautiful</h3>
            <p className="text-gray-700">We use high-quality, non-toxic resin for stunning, safe results.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-violet-900 mb-6 font-serif">Ready to get your own?</h2>
        <a href="/products" className="inline-block px-8 py-3 bg-violet-600 text-white rounded-full font-medium hover:bg-violet-700 transition-colors shadow-lg hover:shadow-xl">
          Browse Our Collection
        </a>
      </section>
    </div>
  );
}

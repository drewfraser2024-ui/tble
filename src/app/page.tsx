import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-turquoise via-turquoise-dark to-black py-20 sm:py-32">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <span className="text-gold-light font-semibold text-sm">Let&apos;s Table It</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            Tble
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Share detailed, meaningful reviews. Rate every aspect of your experience
            — from food to service to atmosphere.
          </p>

          {/* Category Selection */}
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              href="/restaurant"
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-xl bg-pink/10 flex items-center justify-center mb-4 mx-auto group-hover:bg-pink/20 transition-colors">
                <svg className="w-8 h-8 text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
                  <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-black mb-2">
                Restaurant / Chef / Baker
              </h2>
              <p className="text-gray-500 text-sm">
                Rate food quality, customer service, and establishment ambiance
              </p>
              <div className="mt-4 inline-flex items-center text-turquoise-dark font-medium text-sm group-hover:gap-2 transition-all">
                Browse
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              href="/business"
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-xl bg-gold/10 flex items-center justify-center mb-4 mx-auto group-hover:bg-gold/20 transition-colors">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-black mb-2">
                Store / Business
              </h2>
              <p className="text-gray-500 text-sm">
                Rate customer service, shopping experience, and store quality
              </p>
              <div className="mt-4 inline-flex items-center text-turquoise-dark font-medium text-sm group-hover:gap-2 transition-all">
                Browse
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              href="/foodtruck"
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-xl bg-violet/10 flex items-center justify-center mb-4 mx-auto group-hover:bg-violet/20 transition-colors">
                <svg className="w-8 h-8 text-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h.01M16 17h.01M3 11h18M5 11V7a2 2 0 012-2h10a2 2 0 012 2v4M5 11v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-black mb-2">
                Food Truck / Mobile
              </h2>
              <p className="text-gray-500 text-sm">
                Rate food quality, speed of service, and mobile setup
              </p>
              <div className="mt-4 inline-flex items-center text-turquoise-dark font-medium text-sm group-hover:gap-2 transition-all">
                Browse
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12 text-black">
            Why <span className="text-turquoise">Tble</span>?
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-turquoise/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-turquoise" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Detailed Ratings</h3>
              <p className="text-gray-500 text-sm">
                Rate every aspect on a 1-5 star scale across multiple compartments
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-pink/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Voice Reviews</h3>
              <p className="text-gray-500 text-sm">
                Speak your mind with voice-to-text — easier than typing
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Interactive Map</h3>
              <p className="text-gray-500 text-sm">
                Discover top-rated businesses near you on an interactive map
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

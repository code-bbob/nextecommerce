export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black text-gray-300 overflow-hidden">
      {/* Animated gradient background */}

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-gray-800/50 backdrop-blur-sm bg-black/40 px-6 py-16">
          <div className="container mx-auto">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3"> Stay Connected</p>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-mono">
                Get Early Access to Deals
              </h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Subscribe to our tech updates and be the first to know about new arrivals, exclusive drops, and insider events.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md">
                <label htmlFor="newsletter" className="sr-only">Email address</label>
                <input
                  id="newsletter"
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 text-sm bg-white/5 border border-gray-700/50 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all backdrop-blur"
                  required
                />
                <button 
                  type="submit" 
                  className="px-6 py-3 text-sm font-semibold text-white border-blue-400/50 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 whitespace-nowrap border hover:border-blue-400/70 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="px-6 py-16 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {/* Shop */}
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-4"> Shop</p>
                <ul className="space-y-3">
                  <li><a href="/store" className="text-gray-400 hover:text-blue-400 text-sm transition-colors font-light">All Products</a></li>
                  <li><a href="/deals" className="text-gray-400 hover:text-blue-400 text-sm transition-colors font-light">Deals & Offers</a></li>
                  <li><a href="/cpc" className="text-gray-400 hover:text-blue-400 text-sm transition-colors font-light">Custom PC Builder</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-4"> Support</p>
                <ul className="space-y-3">
                  <li><a href="/auth/login" className="text-gray-400 hover:text-blue-400 text-sm transition-colors font-light">My Account</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors font-light">Warranty Info</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors font-light">Return Policy</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-4"> Company</p>
                <ul className="space-y-3">
                  <li><a href="/blog" className="text-gray-400 hover:text-blue-400 text-sm transition-colors font-light">Tech Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors font-light">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors font-light">Contact</a></li>
                </ul>
              </div>

              {/* Socials */}
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">/ Follow</p>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors font-light">Twitter/X</a></li>
                  <li><a href="https://www.facebook.com/profile.php?id=100084059293096" className="text-gray-400 hover:text-blue-400 text-sm transition-colors font-light">Facebook</a></li>
                  <li><a href="https://instagram.com/dgtech_nepal" className="text-gray-400 hover:text-blue-400 text-sm transition-colors font-light">Instagram</a></li>
                </ul>
              </div>
            </div>

            {/* Divider with glow */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent mb-12"></div>

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <p className="text-xs text-gray-600">© {currentYear} Digitech Enterprises</p>
                <div className="hidden md:flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-gray-500">Online</span>
                  </span>
                  <span className="text-gray-700">•</span>
                  <span className="text-gray-500">Best Price Guaranteed</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a>
                <span className="text-gray-700">•</span>
                <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>

        {/* Tech accent line */}
        <div className="h-px bg-gradient-to-r from-blue-600/0 via-blue-600/50 to-blue-600/0"></div>
      </div>
    </footer>
  );
}
  
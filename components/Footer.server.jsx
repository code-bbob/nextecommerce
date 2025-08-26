export default function Footer() {
  return (
    <footer className="py-12 bg-black border-t border-gray-800 text-gray-300">
      <div className="container mx-auto px-6">
        {/* Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white">Get the best deals first</h3>
            <p className="text-gray-400 mt-1">Join our newsletter for new arrivals and exclusive offers.</p>
          </div>
          <form className="flex gap-2">
            <label htmlFor="newsletter" className="sr-only">Email address</label>
            <input
              id="newsletter"
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <button type="submit" className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-3 font-semibold text-white transition-colors">
              Subscribe
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-sm">
          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/store" className="hover:text-white">All Products</a></li>
              <li><a href="/deals" className="hover:text-white">Deals</a></li>
              <li><a href="/cpc" className="hover:text-white">Custom PC</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/auth/login" className="hover:text-white">Account</a></li>
              <li><a href="#" className="hover:text-white">Warranty</a></li>
              <li><a href="#" className="hover:text-white">Returns</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Follow</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Twitter</a></li>
              <li><a href="https://www.facebook.com/profile.php?id=100084059293096" className="hover:text-white">Facebook</a></li>
              <li><a href="https://instagram.com/dgtech_nepal" className="hover:text-white">Instagram</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Bibhab Basnet. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Best Price Guarantee
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
  
export default function Footer() {
    return (
      <footer className=" py-8 bg-black border-t border-gray-700 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Bibhab Basnet. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-6">
          <a
            href="https://twitter.com/digitech"
            className="hover:text-white transition-colors duration-300"
          >
            Twitter
          </a>
          <a
            href="https://facebook.com/digitech"
            className="hover:text-white transition-colors duration-300"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com/digitech"
            className="hover:text-white transition-colors duration-300"
          >
            Instagram
          </a>
        </div>
        <div className="mt-6">
          <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Best Price Guarantee
          </span>
        </div>
      </footer>
    );
  }
  
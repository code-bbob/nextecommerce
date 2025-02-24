"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";
import CartSidebar from "@/components/cartSidebar"; 

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  

  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to a search results page with the query as a URL param
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <header className="shadow-md py-4 px-6 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 bg-green-500 rounded-md"></div>
          <div className="text-2xl font-bold text-white cursor-pointer">
            <Link href="/">
              <div>TechStore</div>
            </Link>
          </div>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
        <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="bg-inherit border border-white-2 rounded b pl-4 pr-10 py-1 text-white focus:outline-none"
            />
            <button type="submit" className="absolute right-1 top-1 text-gray-600 hover:text-white">
              <Search/>
            </button>
          </form>
          <Link href="/">
            <div className="text-gray-200 hover:text-white cursor-pointer">Home</div>
          </Link>
          <Link href="/store">
            <div className="text-gray-200 hover:text-white cursor-pointer">Store</div>
          </Link>
          <Link href="/about">
            <div className="text-gray-200 hover:text-white cursor-pointer">About Us</div>
          </Link>
          <Link href="/contact">
            <div className="text-gray-200 hover:text-white cursor-pointer">Contact</div>
          </Link>
          <Link href="/account">
            <div className="text-gray-200 hover:text-white cursor-pointer">My Account</div>
          </Link>

          <button
        onClick={handleOpenCart}
        className="relative flex items-center justify-center"
        aria-label="Open Cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
            {itemCount}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </nav>
        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-200 hover:text-white focus:outline-none"
            aria-label="Toggle navigation"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 8h16M4 16h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isOpen && (
        <nav className="md:hidden">
          <div className="max-w-7xl text-center mx-auto">
            <ul className="flex flex-col space-y-4 pt-4">
            <li>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full rounded-full pl-4 pr-10 py-1 text-black focus:outline-none"
                  />
                  <button type="submit" className="absolute right-1 top-1 text-gray-600 hover:text-gray-800">
                    <Search/>
                  </button>
                </form>
              </li>
              <li>
                <Link href="/">
                  <div className="block text-gray-200 hover:text-white cursor-pointer">Home</div>
                </Link>
              </li>
              <li>
                <Link href="/store">
                  <div className="block text-gray-200 hover:text-white cursor-pointer">Store</div>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <div className="block text-gray-200 hover:text-white cursor-pointer">About Us</div>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <div className="block text-gray-200 hover:text-white cursor-pointer">Contact</div>
                </Link>
              </li>
              <li>
                <Link href="/account">
                  <div className="block text-gray-200 hover:text-white cursor-pointer">My Account</div>
                </Link>
              </li>
              <li>
                <div className="text-gray-200">$0.00</div>
              </li>
              
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
}

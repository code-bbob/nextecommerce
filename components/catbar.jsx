"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";
import CartSidebar from "@/components/cartSidebar";
import { useDispatch } from "react-redux"; 
import { logout } from "@/redux/accessSlice";
import Image from "next/image";


export default function CatBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.access.isAuthenticated)
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  

  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    
    dispatch(logout());
    router.push("/auth/login");
  }

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
    <header className="shadow-md bg-gradient-to-br from-black via-gray-900 to-black py-4 px-6 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/images/digi.png" alt="logo" width={100} height={50}></Image>
          <div className="text-2xl font-bold text-white cursor-pointer">
          </div>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex font-bold items-center space-x-6">
        
          <Link href="/">
            <div className="text-gray-200 hover:text-white cursor-pointer">Home</div>
          </Link>
          <Link href="/store">
            <div className="text-gray-200 hover:text-white cursor-pointer">Store</div>
          </Link>
          <Link href="/cpc">
            <div className="text-gray-200 hover:text-white cursor-pointer">Custom PC</div>
          </Link>
          
          <Link href="/account">
            <div className="text-gray-200 hover:text-white cursor-pointer">My Account</div>
          </Link>
          {hasHydrated && isLoggedIn &&
          <div onClick={() => handleLogout()}>
            <div className="text-gray-200 hover:text-white cursor-pointer">Logout</div>
          </div>
          }

          <button
        onClick={handleOpenCart}
        className="relative flex items-center justify-center"
        aria-label="Open Cart"
      >
        <ShoppingCart className="h-6 w-6 hover:text-white" />
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
                <Link href="/cpc">
                  <div className="block text-gray-200 hover:text-white cursor-pointer">Custom PC</div>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <div className="block text-gray-200 hover:text-white cursor-pointer">About Us</div>
                </Link>
              </li>
            </ul>
          
          <button
        onClick={handleOpenCart}
        className="relative mt-3 items-center justify-center"
        aria-label="Open Cart"
      >
        <ShoppingCart className="h-6 w-6 text-white" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
            {itemCount}
          </span>
        )}
      </button>
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        </nav>
      )}
    </header>
  );
}

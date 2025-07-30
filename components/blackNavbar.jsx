"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, X, Menu, Zap } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import CartSidebar from "@/components/cartSidebar";
import { logout } from "@/redux/accessSlice";
import customFetch from "@/utils/customFetch";
import { getCDNImageUrl } from "@/utils/imageUtils";

// Debounce hook to limit search requests
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function BlackNavBar({ color = "black" }) {
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux states
  const isLoggedIn = useSelector((state) => state.access.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Local states
  const [hasHydrated, setHasHydrated] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [countdown, setCountdown] = useState("");

  // Debounced search query
  const debouncedQuery = useDebounce(query, 500);

  // Countdown Timer Logic
  useEffect(() => {
    const targetDate = new Date("2025-04-30T23:59:59+05:45").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference < 0) {
        clearInterval(interval);
        setCountdown("Offer Expired!");
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown(
          `${days}d ${hours}h ${minutes}m ${seconds}s`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Ensure client-side hydration
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Fetch suggestions whenever the debounced query changes
  useEffect(() => {
    async function fetchSuggestions() {
      if (debouncedQuery.trim() === "") {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await customFetch(
          `shop/api/navsearch/?search=${encodeURIComponent(debouncedQuery)}`
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } else {
          console.error("Error fetching suggestions");
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSuggestions();
  }, [debouncedQuery]);

  // Handlers
  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchOpen(false);
    setShowSuggestions(false);
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (itemId) => {
    router.push(`/product/${itemId}`);
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchOpen(false);
  };

  const handleClickOutside = () => {
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (showSuggestions) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showSuggestions]);

  const renderSuggestions = () => {
    if (!suggestions.length || !showSuggestions) return null;
    return (
      <div
        className="absolute left-0 right-0 top-full mt-1 bg-gray-900 text-white rounded-md shadow-lg z-50 max-h-60 overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
            onClick={() => handleSuggestionClick(item.id)}
          >
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src={getCDNImageUrl(item.image)}
                alt={item.name}
                fill
                className="object-cover rounded"
                sizes="40px"
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-medium truncate">{item.name}</span>
              <span className="text-sm text-gray-300">Rs. {item.price}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Search Overlay (Mobile & Desktop) */}
      {searchOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={() => {
              setSearchOpen(false);
              setShowSuggestions(false);
            }}
          />
          <div className="fixed top-2 left-1/2 -translate-x-1/2 w-11/12 max-w-xl z-50">
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-sm px-4 py-4 flex items-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-grow bg-transparent text-black focus:outline-none placeholder-gray-500"
                onFocus={() => setShowSuggestions(true)}
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setShowSuggestions(false);
                }}
                className="text-gray-600 hover:text-gray-800 mr-2"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
              <button type="submit" className="text-gray-600 hover:text-gray-800">
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* Mobile search suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="mt-2 bg-gray-900 text-white rounded-md shadow-lg overflow-hidden border border-gray-700">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer border-b border-gray-700 last:border-b-0"
                    onClick={() => handleSuggestionClick(item.id)}
                  >
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={getCDNImageUrl(item.image)}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-medium truncate">{item.name}</span>
                      <span className="text-sm text-gray-300">Rs. {item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="mt-2 p-3 bg-gray-900 text-white rounded-md shadow-lg text-center">
                Loading results...
              </div>
            )}
          </div>
        </>
      )}

      {/* Main Nav Bar */}
      <header className={`bg-${color} text-white sticky p-2 top-0 z-40 shadow-2xl`}>
        <div className="mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left side: Logo + Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidePanelOpen(true)}
              className="md:hidden p-1 text-white hover:text-gray-200 focus:outline-none"
              aria-label="Toggle navigation"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/digi.png"
                alt="logo"
                width={100}
                height={50}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Middle: Desktop Search Bar */}
          <div className="hidden md:flex md:flex-grow mx-6">
            <form
              onSubmit={handleSearch}
              className="relative w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-gray-900 border border-gray-600 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
                onFocus={() => setShowSuggestions(true)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
              >
                <Search className="h-5 w-5" />
              </button>
              {isLoading && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  Loading...
                </div>
              )}
              {renderSuggestions()}
            </form>
          </div>

          {/* Right side: Links + Cart */}
          <div className="flex items-center space-x-5">
            {/* Search Icon for Mobile */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden hover:text-gray-200 focus:outline-none"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Weekly Deals + Store Link */}
            <div className="hidden md:flex items-center space-x-4 font-semibold">
              <Link href="/deals" className="flex items-center hover:scale-105 space-x-1">
                <Zap className="h-5 w-5 text-orange-400" />
                <div>
                  <p className="text-orange-400">NEW YEAR 2082</p>
                  {/* <p className="text-white text-center">DEALS</p> */}
                  {countdown && <p className="text-sm"><span className="text-orange-400">Deals: </span>{countdown}</p>}
                </div>
              </Link>
              <Link href="/store" className="hover:text-gray-200">
                Store
              </Link>
              <Link href="/blog" className="hover:text-gray-200">
                Blogs
              </Link>
              {/* Logout (if logged in) */}
              {hasHydrated && isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-200 focus:outline-none"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={handleOpenCart}
              className="relative flex items-center justify-center hover:text-gray-200 focus:outline-none"
              aria-label="Open Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-1">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Cart Sidebar */}
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        {/* Mobile Side Panel */}
        {isSidePanelOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidePanelOpen(false)}
            />
            {/* Side Navigation */}
            <div className="fixed left-0 top-0 h-full w-3/4 max-w-xs bg-black text-white p-6 z-50 transform transition-transform duration-300">
              <button
                className="mb-6 hover:text-gray-300"
                onClick={() => setIsSidePanelOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
              <nav className="flex flex-col space-y-4 text-lg">
                <Link
                  href="/store"
                  className="hover:text-gray-300"
                  onClick={() => setIsSidePanelOpen(false)}
                >
                  Store
                </Link>
                <Link
                  href="/blog"
                  className="hover:text-gray-300"
                  onClick={() => setIsSidePanelOpen(false)}
                >
                  Blogs
                </Link>
                <Link
                  href="/laptop"
                  className="hover:text-gray-300"
                  onClick={() => setIsSidePanelOpen(false)}
                >
                  Laptops
                </Link>
                <Link
                  href="/smartphone"
                  className="hover:text-gray-300"
                  onClick={() => setIsSidePanelOpen(false)}
                >
                  Smartphones
                </Link>
                <Link
                  href="/accessories"
                  className="hover:text-gray-300"
                  onClick={() => setIsSidePanelOpen(false)}
                >
                  Accessories
                </Link>
                <Link
                  href="/gadgets"
                  className="hover:text-gray-300"
                  onClick={() => setIsSidePanelOpen(false)}
                >
                  Gadgets
                </Link>
                <Link
                  href="/cpc"
                  className="hover:text-gray-300"
                  onClick={() => setIsSidePanelOpen(false)}
                >
                  Custom PC
                </Link>
                {hasHydrated && isLoggedIn && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsSidePanelOpen(false);
                    }}
                    className="hover:text-gray-300 text-left"
                  >
                    Logout
                  </button>
                )}
              </nav>
            </div>
          </>
        )}
      </header>
    </>
  );
}
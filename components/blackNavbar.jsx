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

// Debounce hook to limit search requests
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function BlackNavBar() {
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

  // Debounced search query
  const debouncedQuery = useDebounce(query, 500);

  // Ensure client-side hydration
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Fetch suggestions whenever the debounced query changes
  useEffect(() => {
    async function fetchSuggestions() {
      if (debouncedQuery.trim() === "") {
        setSuggestions([]);
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
        } else {
          console.error("Error fetching suggestions");
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setSuggestions([]);
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
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setSuggestions([]);
    }
  };

  const renderSuggestions = () => {
    if (!suggestions.length) return null;
    return (
      <div className="absolute left-0 right-0 mt-1 bg-black text-white rounded shadow-lg z-10 max-h-60 overflow-y-auto">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              router.push(`/product/${item.id}`);
              setQuery("");
              setSuggestions([]);
            }}
          >
            <div className="relative w-10 h-10">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-white">Rs. {item.price}</span>
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setSearchOpen(false)}
          />
          <form
            onSubmit={handleSearch}
            className="fixed top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-xl bg-white rounded-full px-4 py-2 flex items-center z-50"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-grow bg-transparent text-black focus:outline-none placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-gray-600 hover:text-gray-800 mr-2"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
            <button type="submit" className="text-gray-600 hover:text-gray-800">
              <Search className="h-5 w-5" />
            </button>
            {renderSuggestions()}
          </form>
        </>
      )}

      {/* Main Nav Bar */}
      <header className="bg-black text-white sticky top-0 z-50 shadow-md">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
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
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-gray-900 border border-gray-600 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
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
              <Link href="/store" className="flex items-center space-x-1">
                <Zap className="h-5 w-5 text-orange-400" />
                <span className="text-orange-400">WEEKLY</span>
                <span className="text-white">DEALS</span>
              </Link>
              <Link href="/store" className="hover:text-gray-200">
                Store
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

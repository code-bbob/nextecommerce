"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import CartSidebar from "@/components/cartSidebar";
import { logout } from "@/redux/accessSlice";
import customFetch from "@/utils/customFetch";
import { Zap } from "lucide-react";
import { getCDNImageUrl } from "@/utils/imageUtils";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function NavBar() {
  // States
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.access.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Debounced search query
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Fetch suggestions for search input
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

  // Render search suggestions dropdown
  const renderSuggestions = () => {
    if (!suggestions.length) return null;
    return (
      <div className="absolute mt-1 w-full bg-white text-black rounded shadow-lg z-10 max-h-60 overflow-y-auto">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              router.push(`/product/${item.id}`);
              setQuery("");
              setSuggestions([]);
            }}
          >
            <div className="w-10 h-10 relative">
              <Image
                src={getCDNImageUrl(item.image)}
                alt={item.name}
                fill
                className="object-cover rounded"
                sizes="40px"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-gray-600">RS. {item.price}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {searchOpen && (
        <>
          {/* Background overlay for search */}
          <div
            className="fixed inset-0 backdrop-blur-sm z-40"
            onClick={() => setSearchOpen(false)}
          />
          {/* Search form */}
          <form onSubmit={handleSearch} className="relative z-50">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full md:rounded-full border pl-4 pr-10 py-4 text-black focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 text-gray-600 hover:text-gray-800"
            >
              <div className="flex mt-2 gap-3">
                <X onClick={() => setSearchOpen(false)} />
                <Search />
              </div>
            </button>
            {renderSuggestions()}
          </form>
        </>
      )}

      <header className="sticky top-0 z-10 shadow-md bg-white border py-4 pr-4">
        <div className="relative">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex">
            <button
              onClick={() => setIsSidePanelOpen(true)}
              className="text-black mx-2 md:hidden hover:text-white focus:outline-none"
              aria-label="Toggle navigation"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 8h16M4 16h16"
                />
              </svg>
            </button>
            {/* Logo */}
            <div className="flex ml-3 items-center">
              <Link href="/">
                <Image
                  src="/images/digiblack.png"
                  alt="logo"
                  width={100}
                  height={50}
                />
              </Link>
              <span className="ml-3 text-orange-400 font-extrabold text-3xl">Digi</span><span className="text-black font-extrabold text-2xl">Tech</span>
            </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex font-bold items-center space-x-6 w-full">
              <form onSubmit={handleSearch} className="relative flex-grow mx-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-gray-200 border border-black rounded-xl pl-4 pr-10 py-2 text-black focus:outline-none placeholder:text-gray-500 text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 text-gray-900 hover:text-black"
                >
                  <Search />
                </button>
                {isLoading && (
                  <div className="absolute right-12 top-1 text-gray-300 text-sm">
                    Loading...
                  </div>
                )}
                {renderSuggestions()}
              </form>
                
              <Link href="/store" className="text-black font-bold cursor-pointer">
                <span className="text-orange-400 flex"><Zap/>WEEKLY</span><span className="flex justify-end">DEALS</span>
              </Link>

              <Link href="/store" className="text-black font-bold cursor-pointer">
                Store
              </Link>
              {hasHydrated && isLoggedIn && (
                <div
                  onClick={handleLogout}
                  className="text-black cursor-pointer"
                >
                  Logout
                </div>
              )}

              {/* Cart Button */}
              <button
                onClick={handleOpenCart}
                className="relative flex items-center justify-center"
                aria-label="Open Cart"
              >
                <ShoppingCart className="h-6 w-6 text-black hover:scale-125" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                    {itemCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Mobile Navigation Toggle */}
            <button
                onClick={handleOpenCart}
                className="relative md:hidden flex items-center justify-center"
                aria-label="Open Cart"
              >
                <ShoppingCart className="h-6 w-6 text-black hover:scale-125" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                    {itemCount}
                  </span>
                )}
              </button>
          </div>
        </div>
        <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
              />

        {/* Mobile Side Panel for Categories */}
        {isSidePanelOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black opacity-50 z-40"
              onClick={() => setIsSidePanelOpen(false)}
            />
            {/* Side dialog */}
            <div className="fixed left-0 top-0 h-full w-3/4 max-w-xs bg-black text-white p-6 z-50 transform transition-transform duration-300">
              <button
                className="mb-6"
                onClick={() => setIsSidePanelOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
              <nav className="flex flex-col space-y-4 text-lg">
                {["laptop", "smartphone", "accessories", "gadgets"].map(
                  (cat) => (
                    <Link
                      key={cat}
                      href={`/${cat}`}
                      onClick={() => setIsSidePanelOpen(false)}
                      className="hover:underline"
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Link>
                  )
                )}
                <Link
                  href="/cpc"
                  onClick={() => setIsSidePanelOpen(false)}
                  className="hover:underline"
                >
                  Custom PC
                </Link>
                {hasHydrated && isLoggedIn && (
                  <div
                    onClick={() => {
                      handleLogout();
                      setIsSidePanelOpen(false);
                    }}
                    className="hover:underline cursor-pointer"
                  >
                    Logout
                  </div>
                )}
              </nav>
            </div>
          </>
        )}
      </header>
    </>
  );
}

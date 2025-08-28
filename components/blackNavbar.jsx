"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, X, Menu, Zap, Home, Tag, Gift, User, ChevronRight } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);

  // Debounced search query
  const debouncedQuery = useDebounce(query, 500);

  // Countdown Timer Logic
  useEffect(() => {
    const targetDate = new Date("2025-10-10T23:59:59+05:45").getTime();

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
  setMounted(true);
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

  // Lock body scroll when mobile side panel is open
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    if (isSidePanelOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted, isSidePanelOpen]);

  // Desktop search suggestions dropdown
  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;
    return (
      <div className="absolute left-0 right-0 mt-2 bg-card/95 backdrop-blur-md text-foreground rounded-lg shadow-modern overflow-hidden border border-border z-50">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-accent cursor-pointer border-b border-border/50 last:border-b-0 transition-colors duration-200"
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
    );
  };

  return (
    <>
  {/* Main Nav Bar (fixed) */}
  <header className="bg-card/90 backdrop-blur-md text-foreground fixed top-0 left-0 right-0 w-full p-2 z-40 shadow-modern border-b border-border/30">
        <div className="mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left side: Logo + Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidePanelOpen(true)}
              className="md:hidden p-1 text-foreground hover:text-primary focus:outline-none transition-colors duration-200"
              aria-label="Toggle navigation"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/digiblack.png"
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
                className="w-full bg-input border border-border rounded-full px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                onFocus={() => setShowSuggestions(true)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
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
              <Link href="/deals" className="flex items-center hover:scale-105 space-x-1 transition-transform duration-200">
                <Zap className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-orange-500">Dashain Tihar 2082</p>
                  {/* <p className="text-foreground text-center">DEALS</p> */}
                  {countdown && <p className="text-sm"><span className="text-orange-500">Deals: </span>{countdown}</p>}
                </div>
              </Link>
              <Link href="/store" className="hover:text-primary transition-colors duration-200">
                Store
              </Link>
              <Link href="/blog" className="hover:text-primary transition-colors duration-200">
                Blogs
              </Link>
              {/* Logout (if logged in) */}
              {hasHydrated && isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="hover:text-destructive focus:outline-none transition-colors duration-200"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={handleOpenCart}
              className="relative flex items-center justify-center hover:text-primary focus:outline-none transition-colors duration-200"
              aria-label="Open Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-destructive text-destructive-foreground text-xs rounded-full px-1 shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Cart Sidebar */}
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        {/* Mobile Side Panel (rendered via portal to avoid stacking/containment issues) */}
        {mounted && isSidePanelOpen && createPortal(
          (
            <>
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] md:hidden"
                onClick={() => setIsSidePanelOpen(false)}
              />
              <div className="fixed left-0 top-0 h-full w-11/12 max-w-sm bg-white text-gray-900 z-[1001] md:hidden overflow-y-auto shadow-2xl border-r border-gray-200">
                {/* Header */}
                <div className="relative px-5 pt-5 pb-4 bg-gradient-to-r from-slate-100 to-white border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image src="/images/digi.jpg" alt="DGTech" width={36} height={36} className="rounded" />
                      <div>
                        <p className="text-xs text-gray-500">Welcome to</p>
                        <p className="text-sm font-bold tracking-wide">Digitech Enterprises</p>
                      </div>
                    </div>
                    <button
                      className="p-2 rounded-full hover:bg-gray-100"
                      onClick={() => setIsSidePanelOpen(false)}
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <Link href="/" onClick={() => setIsSidePanelOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50">
                      <Home className="h-4 w-4" /> Home
                    </Link>
                    <Link href="/store" onClick={() => setIsSidePanelOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50">
                      <Tag className="h-4 w-4" /> Store
                    </Link>
                    <Link href="/deals" onClick={() => setIsSidePanelOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50">
                      <Gift className="h-4 w-4" /> Deals
                    </Link>
                  </div>
                </div>

                {/* Categories quick chips */}
                <div className="px-5 py-4 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Shop by category</p>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {["laptop","smartphone","keyboard","headphone","accessories","gadgets","cpc"].map((c) => (
                      <Link key={c} href={`/${c === 'cpc' ? 'cpc' : c}`} onClick={() => setIsSidePanelOpen(false)} className="shrink-0 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-sm">
                        {c === 'cpc' ? 'Custom PC' : c.charAt(0).toUpperCase()+c.slice(1)}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Main navigation list */}
                <nav className="px-2 py-2">
                  {[
                    { href: "/store", label: "Store" },
                    { href: "/blog", label: "Blogs" },
                    { href: "/laptop", label: "Laptops" },
                    { href: "/smartphone", label: "Smartphones" },
                    { href: "/accessories", label: "Accessories" },
                    { href: "/gadgets", label: "Gadgets" },
                    { href: "/cpc", label: "Custom PC" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-gray-50 text-base"
                      onClick={() => setIsSidePanelOpen(false)}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  ))}

                  {hasHydrated && isLoggedIn && (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsSidePanelOpen(false);
                      }}
                      className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      <User className="h-4 w-4" /> Logout
                    </button>
                  )}
                </nav>
              </div>
            </>
          ),
          document.body
        )}
  </header>
  {/* Spacer to offset fixed navbar height */}
  <div className="h-20" aria-hidden="true" />
    </>
  );
}
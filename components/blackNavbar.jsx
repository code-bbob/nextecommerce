"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigationProgress } from "@/hooks/useNavigationProgress";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  X,
  Menu,
  Zap,
  Home,
  Tag,
  Gift,
  User,
  ChevronRight,
  ChevronDown,
  MapPin,
  Phone,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import CartSidebar from "@/components/cartSidebar";
import { logout } from "@/redux/accessSlice";
import customFetch from "@/utils/customFetch";
import { getCDNImageUrl } from "@/utils/imageUtils";
import { SiInstagram, SiFacebook, SiTiktok } from "react-icons/si";

const NAV_CATEGORIES = [
  "laptop",
  "smartphone",
  "keyboard",
  "headphone",
  "monitor",
  "smartwatch",
  "accessories",
  "gadgets",
  "printer",
];

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function BlackNavBar({ color = "black" }) {
  const router = useNavigationProgress();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((s) => s.access.isAuthenticated);
  const cartItems = useSelector((s) => s.cart.items);
  const itemCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  const [hasHydrated, setHasHydrated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [countdown, setCountdown] = useState("");

  const [activeCategory, setActiveCategory] = useState(null);
  const [preFetchedCategories, setPreFetchedCategories] = useState({});

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    setHasHydrated(true);
    setMounted(true);
  }, []);

  // Pre-fetch category data on mount (for mega menu)
  useEffect(() => {
    let isCancelled = false;
    async function fetchCategories() {
      try {
        const res = await customFetch("shop/api/navcat/");
        const data = res.ok ? await res.json() : [];
        
        const dataMap = {};
        
        // Parse the response and organize by category
        data.forEach((categoryObj) => {
          Object.entries(categoryObj).forEach(([categoryName, items]) => {
            if (NAV_CATEGORIES.includes(categoryName.toLowerCase())) {
              dataMap[categoryName.toLowerCase()] = items;
            }
          });
        });
        
        if (!isCancelled) setPreFetchedCategories(dataMap);
      } catch (error) {
        if (!isCancelled) setPreFetchedCategories({});
      }
    }
    fetchCategories();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Defer countdown to not block initial render - starts after content is visible
  useEffect(() => {
    let intervalId;
    const timerId = setTimeout(() => {
      const targetDate = new Date("2026-01-10T23:59:59+05:45").getTime();
      intervalId = setInterval(() => {
        const now = Date.now();
        const diff = targetDate - now;
        if (diff <= 0) {
          setCountdown("Offer Expired!");
          return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }, 1000);
    }, 100);
    return () => {
      clearTimeout(timerId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    async function fetchSuggestions() {
      if (!debouncedQuery.trim()) {
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
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (e) {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    const htmlPrev = document.documentElement.style.overflow;
    if (isSidePanelOpen || searchOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.body.style.height = "100vh";
    }
    return () => {
      document.documentElement.style.overflow = htmlPrev;
      document.body.style.overflow = prev;
      document.body.style.touchAction = "auto";
      document.body.style.height = "auto";
    };
  }, [mounted, isSidePanelOpen, searchOpen]);

  useEffect(() => {
    const onDocClick = () => setShowSuggestions(false);
    if (showSuggestions) document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [showSuggestions]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchOpen(false);
    setShowSuggestions(false);
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setQuery("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (id) => {
    router.push(`/product/${id}`);
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchOpen(false);
  };

  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;
    return (
      <div className="absolute left-0 right-0 mt-2 bg-white text-foreground rounded-lg shadow-modern overflow-hidden border border-border z-50">
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
              <div className="flex gap-3">
                {item.before_deal_price && (
                  <span className="text-sm text-black/70 line-through">
                    Rs. {item.before_deal_price}
                  </span>
                )}
                <span className="text-sm font-bold text-green-600">
                  Rs. {item.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );

  const renderMegaMenu = () => {
    if (!activeCategory) return null;
    const data = preFetchedCategories[activeCategory];
    return (
      <div
        className="absolute left-0 top-full w-full bg-white z-40 border-t border-slate-700 shadow-lg"
        onClick={() => setActiveCategory(null)}
      >
        <div className="mx-auto px-6 py-6">
          {data && data.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {data.map((brandObj, idx) => {
                const items =
                  brandObj.series?.length > 0
                    ? brandObj.series
                    : brandObj.subcategories;
                const hasManyItems = items && items.length > 10;
                const itemChunks = hasManyItems
                  ? chunk(items, Math.ceil(items.length / 2))
                  : [items];

                return (
                  <div key={idx}>
                    <h3
                      onClick={() =>
                        router.push(`/${activeCategory}/${brandObj.brand}`)
                      }
                      className="font-semibold hover:font-bold mb-4 cursor-pointer hover:text-red-700 transition-colors duration-150 text-sm uppercase tracking-wide"
                    >
                      {brandObj.brand}
                    </h3>

                    {items && items.length > 0 ? (
                      <div
                        className={
                          hasManyItems ? "grid grid-cols-2 gap-x-4" : ""
                        }
                      >
                        {itemChunks.map((chunkItems, chunkIndex) => (
                          <ul key={chunkIndex} className="space-y-2">
                            {chunkItems.map((item) => (
                              <li
                                key={item.id}
                                className="cursor-pointer text-gray-800 hover:text-black hover:font-bold transition-colors duration-150 text-sm"
                                onClick={() =>
                                  router.push(
                                    `/${activeCategory}/${brandObj.brand}/${item.name}`
                                  )
                                }
                              >
                                {item.name}
                              </li>
                            ))}
                          </ul>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500">
                        No items available
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">No data found</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Search Overlay */}
      {searchOpen && createPortal(
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-fadeIn md:hidden pointer-events-auto"
            onClick={() => {
              setSearchOpen(false);
              setShowSuggestions(false);
            }}
          />
          <div
            className="fixed top-0 left-0 right-0 z-50 flex flex-col md:hidden animate-slideDown bg-white pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ height: "70vh" }}
          >
            {/* Search Bar */}
            <div className="bg-gradient-to-b from-white to-slate-50 pt-4 px-4 pb-3 border-b border-slate-200 flex-shrink-0 pointer-events-auto">
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-slate-200 shadow-sm"
              >
                <Search className="h-5 w-5 text-slate-400 flex-shrink-0 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products, brands..."
                  className="flex-grow bg-transparent text-slate-900 focus:outline-none placeholder-slate-400 text-sm"
                  onFocus={() => setShowSuggestions(true)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSuggestions([]);
                  }}
                  className={`text-slate-400 hover:text-slate-600 transition-colors duration-200 flex-shrink-0 ${query ? "" : "hidden"}`}
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setShowSuggestions(false);
                  }}
                  className="text-slate-500 hover:text-slate-700 transition-colors duration-200 ml-2 flex-shrink-0"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Results Container - scrollable */}
            <div className="flex-1 overflow-hidden bg-white min-h-0 pointer-events-auto">
              <div className="h-full overflow-y-auto">
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-600">Searching...</p>
                  </div>
                </div>
              )}

              {/* Results Found */}
              {!isLoading && showSuggestions && suggestions.length > 0 && (
                <div className="px-4 py-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">
                    {suggestions.length} Result{suggestions.length !== 1 ? "s" : ""} Found
                  </p>
                  <div className="space-y-2">
                    {suggestions.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 border border-slate-100 hover:border-slate-200 active:scale-95"
                        onClick={() => handleSuggestionClick(item.id)}
                      >
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-slate-100">
                          <Image
                            src={getCDNImageUrl(item.image)}
                            alt={item.name}
                            fill
                            className="object-contain"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {item.before_deal_price && (
                              <span className="text-xs text-slate-400 line-through">
                                Rs. {item.before_deal_price}
                              </span>
                            )}
                            <span className="text-sm font-bold text-red-600">
                              Rs. {item.price}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results State */}
              {!isLoading && showSuggestions && query.trim() && suggestions.length === 0 && (
                <div className="flex items-center justify-center py-16 px-4">
                  <div className="text-center">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Products Found</h3>
                    <p className="text-sm text-slate-500 mb-6">
                      We couldn't find any products matching "<span className="font-medium">{query}</span>"
                    </p>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p>Try:</p>
                      <ul className="space-y-1 text-slate-500">
                        <li>• Checking your spelling</li>
                        <li>• Using different keywords</li>
                        <li>• Browse by category instead</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Initial State (Empty Query) */}
              {!isLoading && !query.trim() && (
                <div className="flex items-center justify-center py-16 px-4">
                  <div className="text-center">
                    <div className="text-5xl mb-4">✨</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Start Searching</h3>
                    <p className="text-sm text-slate-500 mb-6">
                      Find your favorite products easily
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => {
                          router.push("/store");
                          setSearchOpen(false);
                        }}
                        className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-200"
                      >
                        Browse Store
                      </button>
                      <button
                        onClick={() => {
                          router.push("/deals");
                          setSearchOpen(false);
                        }}
                        className="px-3 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-full transition-colors duration-200"
                      >
                        View Deals
                      </button>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Main Nav Bar (fixed) */}
      <header className="bg-white backdrop-blur-md text-foreground fixed top-0 left-0 right-0 w-full z-40 border-b border-gray-200">
        {/* Premium Banner - New Year Sale */}
        <div className="h-10 bg-black hidden md:flex text-white items-center justify-between px-4">
          <div className=" flex items-center gap-6">
            <div className="hidden md:flex font-bold items-center gap-4 text-xs">
              <a
                href="https://maps.google.com/?q=Digitech+Enterprises+Kathmandu+Nepal"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-200 transition-colors duration-200 flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                Kathmandu
              </a>
              <span className="text-white">|</span>
              <a
                href="https://maps.google.com/?q=Digitech+Enterprises+Pokhara+Nepal"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-200 transition-colors duration-200 flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                Pokhara
              </a>
            </div>
          </div>
          <div><p className="text-sm">New Year Sale is now live. Use code "NewYear" for 20% off!</p></div>
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/digitech_nepal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-200 transition-colors duration-200"
              aria-label="Instagram"
            >
              <SiInstagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/digitech.nepal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-200 transition-colors duration-200"
              aria-label="Facebook"
            >
              <SiFacebook className="w-4 h-4" />
            </a>
            <a
              href="https://www.tiktok.com/@digitech_nepal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-200 transition-colors duration-200"
              aria-label="TikTok"
            >
              <SiTiktok className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div className="md:mx-8 px-4 h-16 flex items-center justify-between border-b border-gray-200">
          {/* Left side: Logo + Mobile Menu Button */}
          <div className="flex items-center h-12 w-32 space-x-3">
            <button
              onClick={() => setIsSidePanelOpen(true)}
              className="md:hidden p-1 text-foreground hover:text-primary focus:outline-none transition-colors duration-200"
              aria-label="Toggle navigation"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/digiblack.png"
                alt="logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Middle: Desktop Search Bar */}
          <div className="hidden md:flex md:flex-grow md:justify-center mx-6">
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
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden hover:text-gray-200 focus:outline-none"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>

            <div className="hidden md:flex items-center space-x-6 font-semibold">
              <Link
                href="/deals"
                className="flex items-center hover:scale-105 space-x-1 transition-transform duration-200"
              >
                <Zap className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-orange-500">New Year 2026</p>
                  {countdown && (
                    <p className="text-sm">
                      <span className="text-orange-500">Deals: </span>
                      {countdown}
                    </p>
                  )}
                </div>
              </Link>
              <Link
                href="/store"
                className="hover:text-primary transition-colors duration-200"
              >
                Store
              </Link>
              <Link
                href="/blog"
                className="hover:text-primary transition-colors duration-200"
              >
                Blogs
              </Link>
              {hasHydrated && !isLoggedIn && (
                <Link
                  href="/auth/login"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Login
                </Link>
              )}
              {hasHydrated && isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="hover:text-destructive focus:outline-none transition-colors duration-200"
                >
                  Logout
                </button>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
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

        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        {mounted &&
          isSidePanelOpen &&
          createPortal(
            <>
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] md:hidden"
                onClick={() => setIsSidePanelOpen(false)}
              />
              <div className="fixed left-0 top-0 h-full w-9/12 max-w-xs bg-white text-gray-900 z-[1001] md:hidden overflow-y-auto shadow-2xl border-r border-gray-200">
                <div className="relative px-5 pt-5 pb-4 bg-gradient-to-r from-slate-100 to-white border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/images/digi.jpg"
                        alt="DGTech"
                        width={28}
                        height={28}
                        className="rounded"
                      />
                      <div>
                        <p className="text-xs text-gray-500">Welcome to</p>
                        <p className="text-sm font-bold tracking-wide">
                          Digitech Enterprises
                        </p>
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
                    <Link
                      href="/"
                      onClick={() => setIsSidePanelOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
                    >
                      <Home className="h-4 w-4" /> Home
                    </Link>
                    <Link
                      href="/store"
                      onClick={() => setIsSidePanelOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
                    >
                      <Tag className="h-4 w-4" /> Store
                    </Link>
                    <Link
                      href="/deals"
                      onClick={() => setIsSidePanelOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
                    >
                      <Gift className="h-4 w-4" /> Deals
                    </Link>
                  </div>
                </div>

                <div className="px-5 py-4 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    Shop by category
                  </p>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {[
                      "laptop",
                      "smartphone",
                      "keyboard",
                      "headphone",
                      "accessories",
                      "gadgets",
                      "custom-pc-in-nepal",
                    ].map((c) => (
                      <Link
                        key={c}
                        href={`/${c}`}
                        onClick={() => setIsSidePanelOpen(false)}
                        className="shrink-0 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-sm"
                      >
                        {c
                          .split("-")
                          .map((s) => s[0].toUpperCase() + s.slice(1))
                          .join(" ")}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="px-2 py-2">
                  {[
                    { href: "/store", label: "Store" },
                    { href: "/blog", label: "Blogs" },
                    { href: "/laptop", label: "Laptops" },
                    { href: "/smartphone", label: "Smartphones" },
                    { href: "/accessories", label: "Accessories" },
                    { href: "/gadgets", label: "Gadgets" },
                    { href: "/custom-pc-in-nepal", label: "Custom PC" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-gray-50 text-base"
                      onClick={() => setIsSidePanelOpen(false)}
                    >
                      <div>{link.label}</div>
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
                </div>
              </div>
            </>,
            document.body
          )}

        {/* Desktop Category Bar + Mega Menu (merged from CatBar) */}
        <div className="relative hidden md:flex items-center justify-center max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-10 h-12">
          <div
            className="relative"
            onMouseLeave={() => {
              setActiveCategory(null);
            }}
          >
            <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/${cat}`}
                  className="px-4 py-2 rounded-sm text-sm font-semibold hover:bg-gray-100 transition-all duration-150 whitespace-nowrap"
                  onMouseEnter={() => setActiveCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}{" "}
                  <ChevronDown className="inline-block h-4 w-4" />
                </Link>
              ))}

              <div className="mx-2 h-6 w-px bg-slate-700" />

              <Link
                href="/custom-pc-in-nepal"
                className="px-4 py-2 rounded-sm text-md font-semibold text-red-700 font-bold hover:bg-gray-100 transition-all duration-150 whitespace-nowrap ml-auto"
              >
                Custom PC
              </Link>
            </nav>

            {renderMegaMenu()}
          </div>
        </div>
      </header>

      {/* Spacer to account for fixed navbar height (10 + 16 + 12 = 38rem + borders) */}
      <div className="h-[calc(4rem)] md:h-[calc(2.5rem+4rem+3rem)]" />
    </>
  );
}

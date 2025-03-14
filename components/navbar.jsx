"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import CartSidebar from "@/components/cartSidebar";
import { logout } from "@/redux/accessSlice";
import customFetch from "@/utils/customFetch";

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
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // New states for mega menu
  const [activeCategory, setActiveCategory] = useState(null);
  const [preFetchedCategories, setPreFetchedCategories] = useState({});

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

  // Pre-fetch category data on mount
  useEffect(() => {
    async function fetchCategories() {
      const categories = ["laptop", "smartphone", "accessories", "gadgets"];
      const dataMap = {};
      await Promise.all(
        categories.map(async (category) => {
          try {
            const res = await customFetch(
              `shop/api/navcat/?search=${encodeURIComponent(category)}`
            );
            if (res.ok) {
              dataMap[category] = await res.json();
            } else {
              console.error("Error fetching data for", category);
              dataMap[category] = [];
            }
          } catch (error) {
            console.error("Error fetching data for", category, error);
            dataMap[category] = [];
          }
        })
      );
      setPreFetchedCategories(dataMap);
    }
    fetchCategories();
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
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setSuggestions([]);
    }
  };

  // Render search suggestions dropdown
  const renderSuggestions = () => {
    if (suggestions.length === 0) return null;
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
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-gray-600">${item.price}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render the full-width mega menu based on activeCategory
  const renderMegaMenu = () => {
    if (!activeCategory) return null;
    const data = preFetchedCategories[activeCategory];
    return (
      <div
        className="absolute left-0 top-full w-full bg-white text-black z-50"
        
      >
        <div className="max-w-7xl mx-auto p-6">
          {data && data.length > 0 ? (
            <div className="grid grid-cols-4 gap-6">
              {data.map((brandObj, idx) => (
                <div key={idx} className="border-r pr-4">
                  <h3
                    onClick={() =>
                      router.push(`/${activeCategory}/${brandObj.brand}`)
                    }
                    className="font-bold mb-2 cursor-pointer hover:text-red-500"
                  >
                    {brandObj.brand}
                  </h3>
                  <ul className="space-y-1">
                    {brandObj.series?.map((series) => (
                      <li
                        key={series.id}
                        className="hover:underline cursor-pointer"
                        onClick={() =>
                          router.push(`/${activeCategory}/${series.id}`)
                        }
                      >
                        {series.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No data found for {activeCategory}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <header className="shadow-md py-4 px-6">
      <div className="relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image src="/images/digi.png" alt="logo" width={100} height={50} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex font-bold items-center space-x-6 w-full">
            <form onSubmit={handleSearch} className="relative flex-grow mx-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-inherit border border-white-2 rounded-xl pl-4 pr-10 py-1 text-white focus:outline-none placeholder:text-gray-300"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 text-gray-300 hover:text-white"
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

            <Link
              href="/laptop"
              className="text-gray-200 hover:text-white cursor-pointer"
              onMouseEnter={() => setActiveCategory("laptop")}
              onMouseLeave={() => setActiveCategory(null)}
            >
              Laptops
            </Link>
            <Link
              href="/smartphone"
              className="text-gray-200 hover:text-white cursor-pointer"
              onMouseEnter={() => setActiveCategory("smartphone")}
              onMouseLeave={() => setActiveCategory(null)}

            >
              Smartphones
            </Link>
            <Link
              href="/accessories"
              className="text-gray-200 hover:text-white cursor-pointer"
              onMouseEnter={() => setActiveCategory("accessories")}
              onMouseLeave={() => setActiveCategory(null)}

            >
              Accessories
            </Link>
            <Link
              href="/gadgets"
              className="text-gray-200 hover:text-white cursor-pointer"
              onMouseEnter={() => setActiveCategory("gadgets")}
              onMouseLeave={() => setActiveCategory(null)}

            >
              Gadgets
            </Link>

            <Link
              href="/cpc"
              className="text-gray-200 hover:text-white cursor-pointer"
            >
              Custom PC
            </Link>
            {hasHydrated && isLoggedIn && (
              <div
                onClick={handleLogout}
                className="text-gray-200 hover:text-white cursor-pointer"
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
              <ShoppingCart className="h-6 w-6 text-white hover:scale-105 hover:text-white" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                  {itemCount}
                </span>
              )}
            </button>
            <CartSidebar
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
            />
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

        {/* Full-width Mega Menu */}
        {renderMegaMenu()}
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <nav className="md:hidden relative">
          <div className="max-w-7xl text-center mx-auto">
            <ul className="flex flex-col space-y-4 pt-4">
              <li>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-full pl-4 pr-10 py-1 text-black focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 text-gray-600 hover:text-gray-800"
                  >
                    <Search />
                  </button>
                  {renderSuggestions()}
                </form>
              </li>
              <li>
                <Link
                  href="/"
                  className="block text-gray-200 hover:text-white cursor-pointer"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/store"
                  className="block text-gray-200 hover:text-white cursor-pointer"
                >
                  Store
                </Link>
              </li>
              <li>
                <Link
                  href="/cpc"
                  className="block text-gray-200 hover:text-white cursor-pointer"
                >
                  Custom PC
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block text-gray-200 hover:text-white cursor-pointer"
                >
                  About Us
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
          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />
        </nav>
      )}
    </header>
  );
}

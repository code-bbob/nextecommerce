"use client";
import { useState, useEffect } from "react";
import { useNavigationProgress } from "@/hooks/useNavigationProgress";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import CartSidebar from "@/components/cartSidebar";
import { logout } from "@/redux/accessSlice";
import customFetch from "@/utils/customFetch";
import { getCDNImageUrl } from "@/utils/imageUtils";
import { ChevronDown } from "lucide-react";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function CatBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [preFetchedCategories, setPreFetchedCategories] = useState({});
  const [hoveredNav, setHoveredNav] = useState(null);

  const router = useNavigationProgress();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.access.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Pre-fetch category data on mount
  useEffect(() => {
    async function fetchCategories() {
      const categories = ["laptop", "smartphone","keyboard","headphone", "monitor", "smartwatch", "accessories", "gadgets","printer"];
      const dataMap = {};
      await Promise.all(
        categories.map(async (category) => {
          try { 
            const res = await customFetch(
              `shop/api/navcat/?search=${encodeURIComponent(category)}`
            );
            dataMap[category] = res.ok ? await res.json() : [];
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
      if (!debouncedQuery.trim()) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await customFetch(
          `shop/api/navsearch/?search=${encodeURIComponent(debouncedQuery)}`
        );
        setSuggestions(res.ok ? await res.json() : []);
      } catch (error) {
        console.error("Error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSuggestions();
  }, [debouncedQuery]);

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
    if (!suggestions.length) return null;
    return (
      <div className="absolute  mt-1 w-full bg-card/95 backdrop-blur-md text-foreground rounded-lg shadow-modern border border-border z-10 max-h-60 overflow-y-auto">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-2 hover:bg-accent cursor-pointer transition-colors duration-200"
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
              <span className="text-sm text-muted-foreground">RS. {item.price}</span>
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

  // Render the full-width mega menu based on activeCategory
  const renderMegaMenu = () => {
    if (!activeCategory) return null;
    const data = preFetchedCategories[activeCategory];
    return (
      <div
        className="absolute left-0 top-full w-full bg-white z-40 border-t border-slate-700 shadow-lg"
        onMouseEnter={() => setHoveredNav(activeCategory)}
        onMouseLeave={() => setHoveredNav(null)}
        onClick={() => setActiveCategory(null)}
      >
        <div className="mx-auto px-6 py-6">
          {data && data.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {data.map((brandObj, idx) => {
                const items = brandObj.series?.length > 0 ? brandObj.series : brandObj.subcategories;
                const hasManyItems = items && items.length > 10;
                const itemChunks = hasManyItems ? chunk(items, Math.ceil(items.length / 2)) : [items];

                return (
                  <div key={idx}>
                    {/* Brand Title */}
                    <h3
                      onClick={() => router.push(`/${activeCategory}/${brandObj.brand}`)}
                      className="font-semibold hover:font-bold mb-4 cursor-pointer  hover:text-red-700 transition-colors duration-150 text-sm uppercase tracking-wide"
                    >
                      {brandObj.brand}
                    </h3>
                    
                    {items && items.length > 0 ? (
                      <div className={hasManyItems ? "grid grid-cols-2 gap-x-4" : ""}>
                        {itemChunks.map((chunk, chunkIndex) => (
                          <ul key={chunkIndex} className="space-y-2">
                            {chunk.map((item) => (
                              <li
                                key={item.id}
                                className="cursor-pointer text-gray-800 hover:text-black hover:font-bold transition-colors duration-150 text-sm"
                                onClick={() => router.push(`/${activeCategory}/${brandObj.brand}/${item.name}`)}
                              >
                                {item.name}
                              </li>
                            ))}
                          </ul>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500">No items available</div>
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
      
      <header 
        className="hidden md:block w-full z-30 bg-white shadow-md"
        // onMouseLeave={() => setActiveCategory(null)}
      >
        <div className="relative flex items-center justify-center max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-10 h-12">
          <div 
          className="relative"
          onMouseLeave={() => {
            setActiveCategory(null);
            setHoveredNav(null);
          }}
          >
            <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
              {["laptop", "smartphone","keyboard","headphone", "monitor", "smartwatch", "accessories", "gadgets","printer"].map((cat) => (
                <Link
                  key={cat}
                  href={`/${cat}`}
                  className="px-4 py-2 rounded-sm text-sm font-semibold hover:bg-gray-100 transition-all duration-150 whitespace-nowrap"
                  onMouseEnter={() => setActiveCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)} <ChevronDown className="inline-block h-4 w-4 " />
                </Link>
              ))}
              
              {/* Divider */}
              <div className="mx-2 h-6 w-px bg-slate-700"></div>
              
              {/* Custom PC - Featured Link */}
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
    </>
  );
}

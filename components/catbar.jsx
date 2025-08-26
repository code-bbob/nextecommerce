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
import { getCDNImageUrl } from "@/utils/imageUtils";

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

  const router = useRouter();
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
      const categories = ["laptop", "smartphone","keyboard","headphone", "accessories", "gadgets"];
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

  // Render the full-width mega menu based on activeCategory
  const renderMegaMenu = () => {
    if (!activeCategory) return null;
    const data = preFetchedCategories[activeCategory];
    return (
      <div
        className="absolute left-0 top-full w-full bg-card/95 backdrop-blur-md text-foreground z-40 border-t border-border/30 shadow-modern"
        onMouseEnter={() => setActiveCategory(activeCategory)}
        onMouseLeave={() => setActiveCategory(null)}
      >
        <div className="   mx-0 p-6">
          {data && data.length ? (
            <div className="grid grid-cols-4 gap-6">
              {data.map((brandObj, idx) => (
                <div key={idx} className="border-r border-border/30 pr-4">
                  <h3
                    onClick={() => router.push(`/${activeCategory}/${brandObj.brand}`)}
                    className="font-bold mb-2 cursor-pointer hover:text-primary transition-colors duration-200"
                  >
                    {brandObj.brand}
                  </h3>
                  <ul className="space-y-1">
  {brandObj.series?.length > 0 ? (
    <>
      {brandObj.series?.map((series) => (
        <li
          key={series.id}
          className="hover:underline cursor-pointer text-muted-foreground hover:text-primary transition-colors duration-200"
          onClick={() => router.push(`/${activeCategory}/${brandObj.brand}/${series.id}`)}
        >
          {series.name}
        </li>
      ))}
    </>
  ) : brandObj.subcategories?.length > 0 ? ( //Check for subcategories
    <>
      {brandObj.subcategories?.map((subcategory) => (
        <li
          key={subcategory.id} // Ensure that the key is unique
          className="hover:underline cursor-pointer text-muted-foreground hover:text-primary transition-colors duration-200"
          onClick={() => router.push(`/${activeCategory}/${brandObj.brand}/${subcategory.id}`)} //adjust the route as required.
        >
          {subcategory.name}
        </li>
      ))}
    </>
  ) : (
    <div className="text-muted-foreground">No series or subcategories available</div>
  )}
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
    <>
      
      <header className="shadow-modern hidden md:block bg-black text-white backdrop-blur-md text-foreground py-2 border-b border-border/30 sticky top-16 z-30">
        <div className="relative">
          <div className="mx-auto flex items-center justify-between">
            <nav className=" md:flex ml-10 font-bold items-center space-x-10 w-full">
              {["laptop", "smartphone","keyboard","headphone", "accessories", "gadgets"].map((cat) => (
                <Link
                  key={cat}
                  href={`/${cat}`}
                  className="cursor-pointer hover:text-primary transition-colors duration-200"
                  onMouseEnter={() => setActiveCategory(cat)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Link>
              ))}
              <Link href="/cpc" className="cursor-pointer">
                Custom PC
              </Link>
              
            </nav>

          </div>

          {renderMegaMenu()}
        </div>
      </header>
    </>
  );
}

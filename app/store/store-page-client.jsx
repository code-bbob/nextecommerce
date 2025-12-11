"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductGrid from "@/components/productGrid";
import FilterSidebar from "@/components/filterSidebar";
import CatBar from "@/components/catbar";
import BlackNavBar from "@/components/blackNavbar";
import Footer from "@/components/Footer.server";

export function StorePageClient({ initialProducts, currentPage }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState(initialProducts.results || initialProducts);
  const [pagination, setPagination] = useState({
    count: initialProducts.count,
    total_pages: initialProducts.total_pages,
    current_page: initialProducts.current_page || currentPage,
    next: initialProducts.links?.next,
    previous: initialProducts.links?.previous,
  });
  const [ordering, setOrdering] = useState("");
  const [rating, setRating] = useState("");
  const [minRating, setMinRating] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brandName, setBrandName] = useState("");

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    const currentPath = window.location.pathname;
    router.push(`${currentPath}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-foreground h-full">
      <BlackNavBar color="inherit" />
      <CatBar />

      <div
        className="fixed left-0 top-0 w-6 h-full z-10"
        onMouseEnter={() => setIsSidebarOpen(true)}
      />

      <div className="flex-grow flex md:flex-row flex-col">
        {!isSidebarOpen && (
          <ChevronRight className="fixed top-1/2 h-5 w-5 text-primary hover:text-primary/80 transition-colors" />
        )}

        {isSidebarOpen && (
          <aside
            className={`${
              isSidebarOpen ? "block" : "hidden"
            } md:w-60 sticky top-0 lg:w-72 glass card-modern border-r border-border/30 transition-all duration-300`}
          >
            <div className="overflow-y-auto no-scrollbar">
              <FilterSidebar
                setOrdering={setOrdering}
                setRating={setRating}
                setMinRating={setMinRating}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                setBrandName={setBrandName}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </div>
          </aside>
        )}

        <main className="flex-1 p-4 md:p-8">
          {/* ✅ Products render instantly - NO SKELETON */}
          <ProductGrid
            products={products}
            isLoading={false}
            gridCols={isSidebarOpen ? 4 : 5}
          />

          <div className="flex justify-center items-center mt-8 space-x-4">
            <Button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={!pagination.previous || pagination.current_page === 1}
              className="btn-futuristic bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChevronLeft className="mr-2" /> Previous
            </Button>
            <span className="text-foreground font-medium bg-card/80 px-4 py-2 rounded-lg border border-border/30 shadow-sm">
              {pagination.current_page} of {pagination.total_pages}
            </span>
            <Button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={
                !pagination.next || pagination.current_page === pagination.total_pages
              }
              className="btn-futuristic bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Next <ChevronRight className="ml-2" />
            </Button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

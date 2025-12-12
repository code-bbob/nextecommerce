"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductGrid from "@/components/productGrid";
import FilterSidebar from "@/components/filterSidebar";
import BlackNavBar from "@/components/blackNavbar";
import CatBar from "@/components/catbar";
import Footer from "@/components/Footer.server";
import { Button } from "@/components/ui/button";

/**
 * ProductPageLayout - Consistent layout component for all product listing pages
 * Used by: Store, Search, Category, Deals pages
 */
export default function ProductPageLayout({
  products,
  pagination,
  currentPage,
  onPageChange,
  onOrderingChange,
  onRatingChange,
  onMinRatingChange,
  onMinPriceChange,
  onMaxPriceChange,
  onBrandNameChange,
  pageTitle,
  pageDescription,
  breadcrumbItems = [],
  gridCols = 4,
}) {
  const [ordering, setOrdering] = useState("");
  const [rating, setRating] = useState("");
  const [minRating, setMinRating] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brandName, setBrandName] = useState("");

  const handleOrderingChange = (value) => {
    setOrdering(value);
    onOrderingChange?.(value);
  };

  const handleRatingChange = (value) => {
    setRating(value);
    onRatingChange?.(value);
  };

  const handleMinRatingChange = (value) => {
    setMinRating(value);
    onMinRatingChange?.(value);
  };

  const handleMinPriceChange = (value) => {
    setMinPrice(value);
    onMinPriceChange?.(value);
  };

  const handleMaxPriceChange = (value) => {
    setMaxPrice(value);
    onMaxPriceChange?.(value);
  };

  const handleBrandNameChange = (value) => {
    setBrandName(value);
    onBrandNameChange?.(value);
  };

  const activeFilters = [
    minPrice && { label: `Min: Rs ${minPrice}`, key: "minPrice" },
    maxPrice && { label: `Max: Rs ${maxPrice}`, key: "maxPrice" },
    brandName && { label: brandName, key: "brand" },
    minRating && { label: `${minRating}★+`, key: "rating" },
  ].filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-white to-slate-50/50 text-foreground h-full">
      <BlackNavBar color="inherit" />
      <CatBar />

      {/* Main Content Area - Sidebar and Content Side by Side from Top */}
      <div className="flex-grow flex flex-row relative">
        {/* Sidebar - Starts from top, full height */}
        <aside className="hidden lg:flex lg:w-80 bg-white border-r border-border/5 sticky top-0 h-screen flex-col overflow-hidden">
          {/* Sidebar Header */}
          <div className="px-8 py-6 border-b border-border/5 bg-gradient-to-b from-white to-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-foreground mb-1 uppercase tracking-wider">
                Refine Search
              </h2>
              <div className="h-1 w-6 bg-foreground rounded-full"></div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-8">
              <FilterSidebar
                setOrdering={handleOrderingChange}
                setRating={handleRatingChange}
                setMinRating={handleMinRatingChange}
                setMinPrice={handleMinPriceChange}
                setMaxPrice={handleMaxPriceChange}
                setBrandName={handleBrandNameChange}
                isSidebarOpen={true}
                setIsSidebarOpen={() => {}}
              />
            </div>
          </div>
        </aside>

        {/* Main Content - Page Title and Products */}
        <main className="flex-1 flex flex-col">
          {/* Hero Section - Premium */}
          <section className="bg-white border-b border-border/5 px-6 md:px-10 lg:px-12 pt-8 md:pt-8">
            <div className="max-w-6xl">
              {/* Breadcrumb */}
              {breadcrumbItems.length > 0 && (
                <div className="flex items-center text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wide">
                  {breadcrumbItems.map((item, index) => (
                    <div key={index} className="flex items-center">
                      {item.href ? (
                        <a href={item.href} className="hover:text-foreground transition-colors">
                          {item.label}
                        </a>
                      ) : (
                        <span className="text-foreground">{item.label}</span>
                      )}
                      {index < breadcrumbItems.length - 1 && (
                        <ChevronRight className="h-3 w-3 mx-2.5 opacity-40" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Title Section - Elegant */}
              {pageTitle && (
                <div >
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
                    {pageTitle}
                  </h1>
                  {pageDescription && (
                    <p className="text-base text-muted-foreground font-light">
                      {pageDescription}
                    </p>
                  )}
                </div>
              )}

              {/* Active Filters Display */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border/5">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Active:
                  </span>
                  {activeFilters.map((filter) => (
                    <span
                      key={filter.key}
                      className="inline-flex items-center gap-2 bg-slate-100 text-foreground px-3 py-1.5 rounded-full text-xs font-medium"
                    >
                      {filter.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Products Section */}
          <section className="flex-1 px-6 md:px-10 lg:px-12 py-4">
            <ProductGrid products={products} gridCols={gridCols} />

            {/* Pagination Section */}
            {pagination?.total_pages > 1 && (
              <div className="mt-16 border-t border-border/5 pt-10">
                {/* Pagination Info */}
                <div className="text-center mb-8">
                  <p className="text-sm text-muted-foreground font-light">
                    Page{" "}
                    <span className="font-semibold text-foreground">
                      {pagination.current_page}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-foreground">
                      {pagination.total_pages}
                    </span>
                  </p>
                </div>

                {/* Pagination Buttons */}
                <div className="flex justify-center items-center gap-4">
                  <Button
                    onClick={() => onPageChange?.(pagination.current_page - 1)}
                    disabled={
                      !pagination.previous || pagination.current_page === 1
                    }
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground hover:bg-foreground/85 text-background shadow-sm hover:shadow-lg transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed font-medium"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm">Previous</span>
                  </Button>

                  {/* Page Numbers - Desktop Only */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    {Array.from({
                      length: Math.min(5, pagination.total_pages),
                    }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => onPageChange?.(pageNum)}
                          className={`h-9 w-9 rounded-full font-medium transition-all duration-200 text-sm ${
                            pageNum === pagination.current_page
                              ? "bg-foreground text-background shadow-sm font-bold"
                              : "bg-slate-100 text-foreground hover:bg-slate-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    onClick={() => onPageChange?.(pagination.current_page + 1)}
                    disabled={
                      !pagination.next ||
                      pagination.current_page === pagination.total_pages
                    }
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground hover:bg-foreground/85 text-background shadow-sm hover:shadow-lg transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed font-medium"
                  >
                    <span className="hidden sm:inline text-sm">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}

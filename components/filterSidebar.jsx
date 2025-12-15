"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useState, memo } from "react"
import { X } from "lucide-react"

function FilterSidebar({
  category,
  setOrdering,
  setRating,
  setMinRating,
  setMinPrice,
  setMaxPrice,
  setBrandName,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const [tempMinRating, setTempMinRating] = useState(0)
  const [tempMinPrice, setTempMinPrice] = useState("")
  const [tempMaxPrice, setTempMaxPrice] = useState("")
  const [tempBrandName, setTempBrandName] = useState("")
  const [activeFilters, setActiveFilters] = useState(0)

  const handleOrderChange = (value) => {
    setOrdering(value)
  }

  const handleRatingChange = (value) => {
    setRating(value)
  }

  const handleSlideRatingChange = (value) => {
    setTempMinRating(value[0])
    setMinRating(value[0])
    updateActiveFilters()
  }

  const applyFilters = () => {
    setMinRating(tempMinRating)
    setMinPrice(Number(tempMinPrice) || "")
    setMaxPrice(Number(tempMaxPrice) || "")
    updateActiveFilters()
  }

  const handleBrandFilter = (e, brandName) => {
    e.preventDefault()
    setBrandName(brandName)
    updateActiveFilters()
  }

  const updateActiveFilters = () => {
    let count = 0
    if (tempMinRating > 0) count++
    if (tempMinPrice) count++
    if (tempMaxPrice) count++
    if (tempBrandName) count++
    setActiveFilters(count)
  }

  const resetFilters = () => {
    setOrdering("")
    setRating("")
    setMinRating("")
    setMinPrice("")
    setMaxPrice("")
    setBrandName("")
    setTempMinRating(0)
    setTempMinPrice("")
    setTempMaxPrice("")
    setTempBrandName("")
    setActiveFilters(0)
  }

  return (
    <div className="w-full  bg-transparent text-foreground">
      {/* Filter Groups */}
      <div className="space-y-6">
        {/* Sorting Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Sorting</h3>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Price</label>
            <Select onValueChange={handleOrderChange}>
              <SelectTrigger className="w-full bg-white border border-border/10 text-foreground focus:ring-foreground/20 focus:border-foreground/30 rounded-lg hover:bg-slate-50 transition-colors text-sm h-9">
                <SelectValue placeholder="Sort by price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Low to High</SelectItem>
                <SelectItem value="-price">High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Rating</label>
            <Select onValueChange={handleRatingChange}>
              <SelectTrigger className="w-full bg-white border border-border/10 text-foreground focus:ring-foreground/20 focus:border-foreground/30 rounded-lg hover:bg-slate-50 transition-colors text-sm h-9">
                <SelectValue placeholder="Sort by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Low to High</SelectItem>
                <SelectItem value="-rating">High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Divider */}
        {/* <div className="h-px bg-gray-200"></div> */}

        {/* Filtering Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Filters</h3>

          {/* Rating Filter */}
          <div className="space-y-3 bg-slate-50/50 py-4 rounded-lg border border-border/5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-foreground">Min Rating</label>
              <span className="text-xs font-bold text-foreground bg-white border border-border/10 px-2.5 py-1 rounded-md">{tempMinRating}★</span>
            </div>
            <Slider
              defaultValue={[0]}
              max={5}
              step={1}
              onValueChange={handleSlideRatingChange}
              className="text-foreground"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>0★</span>
              <span>5★</span>
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-3 bg-slate-50/50 py-4 rounded-lg border border-border/5">
            <label className="text-xs font-semibold text-foreground block">Price Range</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={tempMinPrice}
                  placeholder="Min"
                  className="w-full rounded-lg border border-border/10 bg-white text-foreground px-3 py-2 focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all duration-200 placeholder:text-muted-foreground/50 text-xs font-medium"
                  onChange={(e) => setTempMinPrice(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={tempMaxPrice}
                  placeholder="Max"
                  className="w-full rounded-lg border border-border/10 bg-white text-foreground px-3 py-2 focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all duration-200 placeholder:text-muted-foreground/50 text-xs font-medium"
                  onChange={(e) => setTempMaxPrice(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="bg-foreground hover:bg-foreground/85 text-background w-full transition-all duration-200 shadow-sm hover:shadow-md rounded-lg text-xs font-bold h-9"
              onClick={applyFilters}
            >
              Apply Price
            </Button>
          </div>

          {/* Brand Filter */}
          <div className="space-y-3 bg-slate-50/50 py-4 rounded-lg border border-border/5">
            <label className="text-xs font-semibold text-foreground block">Brand</label>
            <form className="flex gap-2" onSubmit={(e) => handleBrandFilter(e, tempBrandName)}>
              <input
                type="text"
                value={tempBrandName}
                placeholder="Search brand..."
                className="flex-1 rounded-lg border border-border/10 bg-white text-foreground px-3 py-2 focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all duration-200 placeholder:text-muted-foreground/50 text-xs font-medium"
                onChange={(e) => setTempBrandName(e.target.value)}
              />
              <Button
                type="submit"
                className="bg-foreground hover:bg-foreground/85 text-background transition-all duration-200 shadow-sm hover:shadow-md rounded-lg font-bold text-xs px-3 h-9"
              >
                Go
              </Button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-border/20 to-transparent"></div>

        {/* Reset Section */}
        <Button
          className="w-full bg-white hover:bg-red-50 text-foreground border border-border/10 hover:border-red-200 hover:text-red-600 transition-all duration-200 shadow-sm hover:shadow-md rounded-lg font-semibold text-xs h-9"
          onClick={resetFilters}
          variant="outline"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      </div>
    </div>
  )
}

export default memo(FilterSidebar)

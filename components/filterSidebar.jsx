"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sliders, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export default function FilterSidebar({
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
    updateActiveFilters()
  }

  const handleRatingChange = (value) => {
    setRating(value)
    updateActiveFilters()
  }

  const handleSlideRatingChange = (value) => {
    setTempMinRating(value[0])
  }

  const updateActiveFilters = () => {
    let count = 0
    if (tempMinRating > 0) count++
    if (tempMinPrice) count++
    if (tempMaxPrice) count++
    if (tempBrandName) count++
    setActiveFilters(count)
  }

  const applyFilters = () => {
    setMinRating(tempMinRating)
    setMinPrice(Number(tempMinPrice))
    setMaxPrice(Number(tempMaxPrice))
    updateActiveFilters()
  }

  const handleBrandFilter = (e, brandName) => {
    e.preventDefault()
    setBrandName(brandName)
    updateActiveFilters()
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
    <div className="p-4 h-full w-full no-scrollbar bg-gray-900 text-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <Sliders className="h-5 w-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Filters</h2>
          {activeFilters > 0 && (
            <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">{activeFilters}</span>
          )}
        </div>
        <Button variant="ghost" className="text-indigo-400 hover:bg-white" onClick={() => setIsSidebarOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Sort by Price */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-1 text-indigo-300">Sort by Price</h3>
        <Select onValueChange={handleOrderChange}>
          <SelectTrigger className="w-full bg-gray-800 border border-gray-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price: Low to High</SelectItem>
            <SelectItem value="-price">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort by Rating */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-1 text-indigo-300">Sort by Rating</h3>
        <Select onValueChange={handleRatingChange}>
          <SelectTrigger className="w-full bg-gray-800 border border-gray-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Rating: Low to High</SelectItem>
            <SelectItem value="-rating">Rating: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Minimum Rating */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-indigo-300">Minimum Rating</h3>
          <span className="text-white font-bold">{tempMinRating} ★</span>
        </div>
        <Slider
          defaultValue={[0]}
          max={5}
          step={1}
          onValueChange={handleSlideRatingChange}
          className="text-indigo-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-1 text-indigo-300">Price Range</h3>
        <div className="flex space-x-2">
          <div className="w-full">
            <label className="text-xs text-gray-400 mb-1 block">Min Price</label>
            <input
              type="number"
              value={tempMinPrice}
              placeholder="0"
              className="w-full rounded-md border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setTempMinPrice(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label className="text-xs text-gray-400 mb-1 block">Max Price</label>
            <input
              type="number"
              value={tempMaxPrice}
              placeholder="1000"
              className="w-full rounded-md border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setTempMaxPrice(e.target.value)}
            />
          </div>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white mt-3 w-full transition-colors duration-200"
          onClick={applyFilters}
        >
          Apply Price Range
        </Button>
      </div>

      {/* Brand Name */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-2 text-indigo-300">Brand Name</h3>
        <form className="flex gap-2" onSubmit={(e) => handleBrandFilter(e, tempBrandName)}>
          <input
            type="text"
            value={tempBrandName}
            placeholder="Search by brand..."
            className="w-full rounded-md border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setTempBrandName(e.target.value)}
          />
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-16 transition-colors duration-200"
          >
            Apply
          </Button>
        </form>
      </div>

      {/* Reset Filters */}
      <Button
        className="w-full bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200"
        onClick={resetFilters}
      >
        Reset All Filters
      </Button>
    </div>
  )
}

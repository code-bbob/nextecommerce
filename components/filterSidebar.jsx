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

  const handleOrderChange = (value) => {
    setOrdering(value)
  }

  const handleRatingChange = (value) => {
    setRating(value)
  }

  const handleSlideRatingChange = (value) => {
    setTempMinRating(value[0])
  }

  const applyFilters = () => {
    setMinRating(tempMinRating)
    setMinPrice(Number(tempMinPrice))
    setMaxPrice(Number(tempMaxPrice))
    setIsSidebarOpen(false)
  }

  const handleBrandFilter = (e, brandName) => {
    e.preventDefault()
    setBrandName(brandName)
    setIsSidebarOpen(false)
  }

  return (
    <div className="p-4 w-full h-screen bg-gray-900 text-gray-100 border-r border-gray-700 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Sliders className="h-5 w-5 text-white" />
          <h2 className="text-xl font-bold text-white">Filters</h2>
        </div>
        {isSidebarOpen && (
          <Button variant="ghost" className="md:hidden text-indigo-400" onClick={() => setIsSidebarOpen(false)}>
            <X />
          </Button>
        )}
      </div>

      {/* Sort by Price */}
      <Select onValueChange={handleOrderChange}>
        <SelectTrigger className="w-full mb-4 bg-gray-700 border border-indigo-500 text-gray-100">
          <SelectValue placeholder="Sort by price" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price">Price: Low to High</SelectItem>
          <SelectItem value="-price">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort by Rating */}
      <Select onValueChange={handleRatingChange}>
        <SelectTrigger className="w-full mb-4 bg-gray-700 border border-indigo-500 text-gray-100">
          <SelectValue placeholder="Sort by rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rating">Rating: Low to High</SelectItem>
          <SelectItem value="-rating">Rating: High to Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Minimum Rating */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2 text-white">Minimum Rating</h3>
        <Slider
          defaultValue={[0]}
          max={5}
          step={1}
          onValueChange={handleSlideRatingChange}
          className="text-indigo-400"
        />
      </div>

      {/* Price Range */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2 ">Price Range</h3>
        <div className="flex space-x-2">
          <input
            type="number"
            value={tempMinPrice}
            placeholder="Min"
            className="w-full rounded-md border border-indigo-500 bg-gray-700 text-gray-100 px-2 h-10"
            onChange={(e) => setTempMinPrice(e.target.value)}
          />
          <input
            type="number"
            value={tempMaxPrice}
            placeholder="Max"
            className="w-full rounded-md border border-indigo-500 bg-gray-700 text-gray-100 px-2 h-10"
            onChange={(e) => setTempMaxPrice(e.target.value)}
          />
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white" onClick={applyFilters}>
            Apply
          </Button>
        </div>
      </div>

      {/* Brand Name */}
      <h3 className="text-sm font-semibold my-4">Brand Name</h3>
      <form className="flex gap-2" onSubmit={(e) => handleBrandFilter(e, tempBrandName)}>
        <input
          type="text"
          value={tempBrandName}
          placeholder="Search by brand..."
          className="w-full rounded-md border border-indigo-500 bg-gray-700 text-gray-100 px-2 py-1"
          onChange={(e) => setTempBrandName(e.target.value)}
        />
        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white w-16">
          Apply
        </Button>
      </form>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sliders, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export default function FilterSidebar({ category, setOrdering, setRating,setMinRating,setMinPrice,setMaxPrice,setBrandName, isSidebarOpen, setIsSidebarOpen }) {
  const handleOrderChange = (value) => {
    setOrdering(value)
  }

  const handleRatingChange = (value) => {
    setRating(value)
  }

  // Initialize slideRating state (defaulting to 2, for example)

  // The slider returns its value as an array.
  // Update slideRating with the first element.
  const handleSlideRatingChange = (value) => {
    setMinRating(value[0])
  }

  
  const [tempMinRating, setTempMinRating] = useState(0);
  const [tempMinPrice, setTempMinPrice] = useState('');
  const [tempMaxPrice, setTempMaxPrice] = useState('');
  const [tempBrandName, setTempBrandName] = useState('');

  const applyFilters = () => {
    setMinRating(tempMinRating);
    setMinPrice(Number(tempMinPrice));
    setMaxPrice(Number(tempMaxPrice));
    setIsSidebarOpen(false);
  };

  const handleBrandFilter = (e,brandName) => {
    e.preventDefault();
    setBrandName(brandName);
    setIsSidebarOpen(false);
  } 


  return (
    <div className="p-4  w-full h-screen shadow-2xl bg-white border-r border-white/10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Sliders className="mr-2 h-5 w-5 text-black" />
          <h2 className="text-xl font-bold text-black">Filters</h2>
        </div>
        {/* Show close button only on mobile (when sidebar modal is open) */}
        {isSidebarOpen && (
          <Button variant="ghost" className="md:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
            <X />
          </Button>
        )}
      </div>
      <Select onValueChange={handleOrderChange}>
        <SelectTrigger className="w-full bg-white text-black border-black mb-4">
          <SelectValue placeholder="Sort by price" />
        </SelectTrigger>
        <SelectContent className="">
          <SelectItem value="price">Price: Low to High</SelectItem>
          <SelectItem value="-price">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={handleRatingChange}>
        <SelectTrigger className="w-full border  text-black border-black mb-4">
          <SelectValue placeholder="Sort by rating" />
        </SelectTrigger>
        <SelectContent className="">
          <SelectItem value="rating">Rating: Low to High</SelectItem>
          <SelectItem value="-rating">Rating: High to Low</SelectItem>
        </SelectContent>
      </Select>
      <div className="mt-4">
        <h3 className="text-yellow-500 font-semibold mb-2">Minimum Rating</h3>
        <Slider
          defaultValue={[0]}
          max={5}
          step={1}
          onValueChange={handleSlideRatingChange}
        />
        
      </div>
      <div className="mt-4">
        <h3 className="text-black font-semibold mb-2">Price Range</h3>
        <div className="flex space-x-2">
          <input
            type="number"
            value={tempMinPrice}
            placeholder="Min Price"
            className="w-full rounded-md border border-black bg-white text-black  px-2 h-10"
            onChange={(e) => setTempMinPrice(e.target.value)}
          />
          <input
            type="number"
            value={tempMaxPrice}
            placeholder="Max Price"
            className="w-full rounded-md border border-black bg-white text-black px-2  h-10"
            onChange={(e) => setTempMaxPrice(e.target.value)}
          />
      <Button  className="bg-black" onClick={applyFilters}>
        Apply 
      </Button>
        </div>

      </div>
      

      <h3 className="text-black font-semibold my-2">Brand Name</h3>
      <form className="flex gap-2 " onSubmit={(e)=>handleBrandFilter(e,tempBrandName)}>
        <input
          type="text"
          value={tempBrandName}
          placeholder="Search by brand..."
          className="w-full rounded-md border border-black bg-white text-black px-2 py-1"
          onChange={(e) => setTempBrandName(e.target.value)}
        />

      <Button type="submit"className="w-16 bg-black">
        Apply
      </Button>
      </form>

    </div>
      
  )
}

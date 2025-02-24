"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sliders, X } from "lucide-react"

export default function FilterSidebar({ category, setOrdering, isSidebarOpen, setIsSidebarOpen }) {
  const handleOrderChange = (value) => {
    setOrdering(value)
  }

  return (
    <div
      className={`${isSidebarOpen ? "fixed inset-y-0 left-0 w-64 bg-gradient-to-br from-black via-slate-500 to-black " : ""} md:sticky md:top-0 shadow-2xl p-4 h-full overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Sliders className="mr-2 h-5 w-5 text-white" />
          <h2 className="text-xl font-semibold text-white">Filters</h2>
        </div>
        <Button variant="ghost" className="md:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
          <X />
        </Button>
      </div>
      <Select onValueChange={handleOrderChange}>
        <SelectTrigger className="w-full bg-white/20 text-white border-none mb-4">
          <SelectValue placeholder="Sort by price" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price">Price: Low to High</SelectItem>
          <SelectItem value="-price">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
      {/* Add more filter options here */}
    </div>
  )
}


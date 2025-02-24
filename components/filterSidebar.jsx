"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sliders, ChevronDown, ChevronUp } from "lucide-react";

export default function FilterSidebar({ category, setOrdering }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOrderChange = (value) => {
    setOrdering(value);
  };

  return (
    <div className="sticky top-0 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Sliders className="mr-2 h-5 w-5 text-white" />
          <h2 className="text-xl font-semibold text-white">Filters</h2>
        </div>
        <Button variant="ghost" className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
      <div className={`${isOpen ? "block" : "hidden"} md:block`}>
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
    </div>
  );
}
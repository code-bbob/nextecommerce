"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, onValueChange, ...props }, ref) => {
  // Initialize state with the default value (or [0] if not provided)
  const [currentValue, setCurrentValue] = React.useState(props.defaultValue || [0])

  // Handler to update state and notify parent components
  const handleValueChange = (val) => {
    setCurrentValue(val)
    if (onValueChange) {
      onValueChange(val)
    }
  }

  return (
    <div className="flex flex-col">
      <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        {...props}
        onValueChange={handleValueChange}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-400">
          <SliderPrimitive.Range className="absolute h-full bg-black" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
      
      {/* <div className="flex justify-between mt-2">
        <span className="text-xs font-bold ">0 </span>
        <span className="text-xs font-bold">5 </span>
      </div>
      <div className="mt-2 text-sm font-bold">
    Chosen value: {currentValue[0]}
  </div> */}
    </div>
    
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

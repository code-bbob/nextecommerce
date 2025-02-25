"use client"

import { useState } from "react"
import Image from "next/image"
import { useSelector } from "react-redux"
import { ChevronDown, ChevronUp } from "lucide-react"

export function OrderSummary() {
  const [isExpanded, setIsExpanded] = useState(false)
  const cartItems = useSelector((state) => state.cart.items)
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingCost = useSelector((state) => state.checkout.shippingCost)
  const total = subtotal + shippingCost

  // Mobile summary header
  const MobileSummaryHeader = () => (
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className="w-full flex items-center justify-between p-4 bg-black text-white border-b border-gray-800"
    >
      <div className="flex items-center gap-2">
        <span className="text-blue-500">Order summary</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>
      <span className="font-semibold">${total.toFixed(2)}</span>
    </button>
  )

  // Content for both mobile and desktop
  const SummaryContent = () => (
    <>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          <h2 className="text-lg text-center font-semibold lg:mb-6">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.product_id} className="flex items-center gap-4">
              <div className="relative w-16 h-16 bg-gray-800 rounded">
                <div className="absolute -right-2 -top-2 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                  {item.quantity}
                </div>
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-400">{item.variant}</p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-800 p-6 bg-black">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Shipping</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">USD</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden bg-black text-white">
        <MobileSummaryHeader />
        <div
          className={`${
            isExpanded ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          } transition-all duration-300 ease-in-out overflow-hidden`}
        >
          <SummaryContent />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block lg:w-[380px]">
        <div className="fixed w-[380px] h-screen right-0 top-0 border-l border-gray-800 bg-black">
          <div className="flex flex-col h-full">
            <SummaryContent />
          </div>
        </div>
      </div>
    </>
  )
}


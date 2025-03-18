"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Star, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { addToCart, sendCartToServer } from '@/redux/cartSlice'
import CartSidebar from "@/components/cartSidebar"
import { getLocalCart, setLocalCart } from "@/utils/localCart"
import { useRouter } from "next/navigation"

export default function ProductGrid({ products, isLoading }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((state) => state.access.isAuthenticated)
  const router = useRouter()

  const handleEmi = (e,product_id) => {
    e.stopPropagation()
    e.preventDefault()
    router.push(`/product/emi/${product_id}`);
  }

  const handleAddToCart = (e,product) => {
    e.stopPropagation()
    e.preventDefault()
    setIsCartOpen(true)
    
    const cartItem = {
      product_id: product.product_id,
      price: product.price,
      image: product.images[0]?.image,
      name: product.name,
      quantity: 1,
    }
    
    // Update Redux cart state
    dispatch(addToCart(cartItem))
    
    if (isLoggedIn) {
      // If user is logged in, send the item to the server
      dispatch(sendCartToServer(cartItem))
} else {
    // Otherwise, update the local cart in localStorage
    const localCart = getLocalCart()
    const existingIndex = localCart.findIndex(item => item.product_id === product.product_id)
    if (existingIndex !== -1) {
    // Increase quantity if already exists
    localCart[existingIndex].quantity += 1
    } else {
    localCart.push(cartItem)
    }
    setLocalCart(localCart)
}
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-2  md:gap-3">
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {products?.map((product) => (
        <motion.div
        key={product.product_id}
        // Use flex and flex-col to control vertical spacing
        className="flex flex-col bg-white text-black rounded-lg overflow-hidden shadow-lg"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        onClick={() => router.push(`/product/${product.product_id}`)}
      >
        {/* Image Container */}
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <Image
            src={product.images[0]?.image || "/placeholder.svg"}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 hover:scale-110"
          />
          <Badge className="absolute top-2 right-2 font-bold bg-red-800">
            {product.category?.toLocaleUpperCase()}
          </Badge>
        </div>
      
        {/* Content Container */}
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          {/* Product Title */}
          <h3 className="text-base mb-2 line-clamp-3">
            {product.name}
          </h3>
      
          {/* Rating */}
          <div className="flex items-center mb-2">
            <Star className="text-yellow-400 mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">
              {product.ratings.stats.avg_rating.toFixed(1)}
            </span>
          </div>
      
          {/* Old Price / New Price */}
          <div>

          {product.old_price && (
            <strike className="text-lg sm:text-lg font-bold mb-3 mr-5 sm:mb-4">
              RS. {product.old_price}
            </strike>
          )}
          <p className="text-lg sm:text-lg font-bold text-yellow-600 mb-2">
            RS. {product.price}
          </p>
          </div>
      
          {/* Use mt-auto on the bottom section to push it to the bottom */}
          <div className="mt-auto">
            <div className="text-xs mt-2 h-8">Free Shipping</div>
            <Button
              size="sm"
              onClick={(e) => handleAddToCart(e, product)}
              className="text-xs sm:text-sm bg-red-800 hover:bg-red-600 text-white"
            >
              <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
              Add to cart
            </Button>
          </div>
        </div>
      </motion.div>

      ))}
            
      {products?.length === 0 && (
        <div className="text-black text-center col-span-2 md:col-span-3 lg:col-span-4">
          No products found
        </div>
      )}  
    </div>
  )
}

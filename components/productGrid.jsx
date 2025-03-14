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
    <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-3 gap-2  md:gap-6">
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {products?.map((product) => (
        <motion.div
          key={product.product_id}
          className="bg-gradient-to-br from-black via-gray-800 to-black backdrop-blur-md rounded-lg overflow-hidden shadow-lg"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
          onClick={() => router.push(`/product/${product.product_id}`)}
        >
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
          <div className="p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-white truncate">
              {product.name}
            </h3>
            <div className="flex items-center mb-2">
              <Star className="text-yellow-400 mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm text-gray-300">
                {product.ratings.stats.avg_rating.toFixed(1)}
              </span>
            </div>
            {/* <span className="text-lg sm:text-lg font-bold mb-3  sm:mb-4 text-green-400">RS. </span> */}
            {product.old_price &&<strike className="text-lg sm:text-lg font-bold mb-3 mr-5 sm:mb-4 text-gray-400">RS. {product.old_price}</strike>}
            <span className="text-lg sm:text-lg font-bold mb-3 sm:mb-4 text-green-400">
              RS. {product.price}
            </span>
            <div className="flex flex-col justify-center items-center">
              <Button
                variant="outline"
                onClick={(e)=>handleEmi(e,product.product_id)}
                size="sm"
                className="text-xs w-full sm:text-xs text-white border-black bg-zinc-500 mb-2 hover:font-bold"
              >
                Apply EMI
              </Button>
              {/* <div></div> */}
              <Button
                size="sm"
                onClick={(e) => handleAddToCart(e,product)}
                className="text-xs w-full sm:text-sm bg-red-800 hover:bg-red-600 text-white"
              >
                <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Add to cart
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
            {products?.map((product) => (
        <motion.div
          key={product.product_id}
          className="bg-gradient-to-br from-black via-gray-800 to-black backdrop-blur-md rounded-lg overflow-hidden shadow-lg"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
          onClick={() => router.push(`/product/${product.product_id}`)}
        >
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
          <div className="p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-white truncate">
              {product.name}
            </h3>
            <div className="flex items-center mb-2">
              <Star className="text-yellow-400 mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm text-gray-300">
                {product.ratings.stats.avg_rating.toFixed(1)}
              </span>
            </div>
            <p className="text-lg sm:text-lg font-bold mb-3 sm:mb-4 text-green-400">
              RS. {product.price.toFixed(2)}
            </p>
            <div className="flex justify-center items-center">
              {/* <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-xs text-white border-black bg-black hover:font-bold"
              >
                <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />View
              </Button> */}
              {/* <div></div> */}
              <Button
                size="sm"
                onClick={(e) => handleAddToCart(e,product)}
                className="text-xs sm:text-sm bg-red-800 hover:bg-red-600 text-white"
              >
                <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Add to cart
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
      {products?.length === 0 && (
        <div className="text-white text-center col-span-2 md:col-span-3 lg:col-span-4">
          No products found
        </div>
      )}  
    </div>
  )
}

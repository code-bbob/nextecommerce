"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { addToCart, sendCartToServer } from "@/redux/cartSlice"
import CartSidebar from "@/components/cartSidebar"
import { getLocalCart, setLocalCart } from "@/utils/localCart"
import { useRouter } from "next/navigation"
import { getCDNImageUrl } from "@/utils/imageUtils"

// Skeleton component for product cards
const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col bg-card border border-border rounded-lg overflow-hidden shadow-modern card-modern animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-40 sm:h-48 bg-muted"></div>

      {/* Content Skeleton */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Title Skeleton */}
        <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>

        {/* Rating Skeleton */}
        <div className="flex items-center mb-2">
          <div className="h-3 w-3 sm:h-4 sm:w-4 bg-muted rounded-full mr-1"></div>
          <div className="h-3 w-6 bg-muted rounded"></div>
        </div>

        {/* Price Skeleton */}
        <div className="h-5 w-24 bg-muted rounded mb-2"></div>

        {/* Bottom section */}
        <div className="mt-auto">
          <div className="h-4 w-20 bg-muted rounded mt-2 mb-2"></div>
          <div className="h-8 w-full bg-muted rounded"></div>
        </div>
      </div>
    </div>
  )
}

export default function ProductGrid({ products, isLoading, gridCols = 5 }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((state) => state.access.isAuthenticated)
  const router = useRouter()

  const handleEmi = (e, product_id) => {
    e.stopPropagation()
    e.preventDefault()
    router.push(`/product/emi/${product_id}`)
  }

  const handleAddToCart = (e, product) => {
    e.stopPropagation()
    e.preventDefault()
    setIsCartOpen(true)

    const cartItem = {
      product_id: product.product_id,
      price: product.price,
      image: getCDNImageUrl(product.images[0]?.image),
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
      const existingIndex = localCart.findIndex((item) => item.product_id === product.product_id)
      if (existingIndex !== -1) {
        // Increase quantity if already exists
        localCart[existingIndex].quantity += 1
      } else {
        localCart.push(cartItem)
      }
      setLocalCart(localCart)
    }
  }

  // Determine the grid columns class based on gridCols prop
  const gridColumnsClass = gridCols === 4
    ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"

  if (isLoading) {
    return (
      <div className={`grid ${gridColumnsClass} gap-2 md:gap-3`}>
        {Array(8)
          .fill()
          .map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))}
      </div>
    )
  }

  return (
    <div className={`grid ${gridColumnsClass} gap-2 md:gap-3`}>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {products?.map((product) => (
        <motion.div
          key={product.product_id}
          className="flex flex-col bg-card border border-border rounded-lg overflow-hidden shadow-modern card-modern hover:shadow-futuristic text-foreground relative group transition-all duration-300"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
          onClick={() => router.push(`/product/${product.product_id}`)}
        >
          {/* Special Deal Ribbon */}
          {product.deal && (
            <div className="absolute -left-1.5 top-44 z-20 pointer-events-none">
              {/* Ribbon main part */}
              <div className="relative">
                {/* Ribbon background */}
                <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold py-1 px-8 text-xs shadow-md flex items-center justify-center">
                  New Year Deal
                </div>

                {/* Top triangle cutout */}
                <div className="absolute -top-3 left-0 w-0 h-0 border-b-[12px] border-l-[6px] border-l-transparent border-b-primary/80"></div>

                {/* Bottom triangle cutout */}
                <div className="absolute -bottom-3 left-0 w-0 h-0 border-t-[12px] border-l-[6px] border-l-transparent border-t-primary/80"></div>

                {/* Right side shadow effect */}
                <div className="absolute top-0 -right-3 w-0 h-0 border-t-[14px] border-b-[14px] border-l-[12px] border-l-primary/60 border-t-transparent border-b-transparent"></div>
              </div>
            </div>
          )}

          {/* Image Container */}
          <div className="relative h-40 sm:h-48 overflow-hidden bg-muted/30">
            <Image
              src={getCDNImageUrl(product.images[0]?.image) || "/placeholder.svg"}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              className="transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
            <Badge className="absolute top-2 right-2 font-bold bg-primary text-primary-foreground z-20 shadow-sm">
              {product.category?.toLocaleUpperCase()}
            </Badge>
          </div>

          {/* Content Container */}
          <div className="p-3 sm:p-4 flex flex-col flex-grow">
            {/* Product Title */}
            <h3 className="text-base mb-2 line-clamp-3 font-medium text-foreground">{product.name}</h3>

            {/* Rating */}
            <div className="flex items-center mb-2">
              <Star className="text-yellow-500 mr-1 h-3 w-3 sm:h-4 sm:w-4 fill-current" />
              <span className="text-xs sm:text-sm text-muted-foreground">{product.ratings.stats.avg_rating.toFixed(1)}</span>
            </div>

            {/* Old Price / New Price */}
            <div>
              {product.old_price && (
                <strike className="text-lg sm:text-lg font-bold mb-3 mr-5 sm:mb-4 text-muted-foreground">RS. {product.old_price}</strike>
              )}
              {
                (product.deal && product.before_deal_price)?<strike className="text-lg sm:text-lg font-bold text-amber-600 mb-2">RS. {product.before_deal_price}</strike>:<p className="text-lg sm:text-lg font-bold text-primary mb-2">RS. {product.price}</p>
              }
              {product.deal && product.before_deal_price && <p className="text-lg sm:text-lg font-bold text-emerald-600 mb-2">RS. {product.price}</p> }
            </div>

            {/* Use mt-auto on the bottom section to push it to the bottom */}
            <div className="mt-auto">
              <div className="text-xs mt-2 h-8 text-emerald-600 font-medium">✓ Free Shipping</div>
              <Button
                size="sm"
                onClick={(e) => handleAddToCart(e, product)}
                className="text-xs sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground btn-futuristic w-full shadow-sm hover:shadow-md transition-all duration-200"
              >
                <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Add to cart
              </Button>
            </div>
          </div>
        </motion.div>
      ))}

      {products?.length === 0 && !isLoading && (
        <div className="text-muted-foreground text-center col-span-2 md:col-span-3 lg:col-span-4">
          <div className="text-lg font-medium">No products found</div>
          <div className="text-sm mt-1">Try adjusting your filters or search terms</div>
        </div>
      )}
    </div>
  )
}
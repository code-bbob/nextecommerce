"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, SearchX, RotateCcw, Store, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDispatch, useSelector } from "react-redux"
import { useState, memo } from "react"
import { addToCart, sendCartToServer } from "@/redux/cartSlice"
import CartSidebar from "@/components/cartSidebar"
import { getLocalCart, setLocalCart } from "@/utils/localCart"
import { useNavigationProgress } from "@/hooks/useNavigationProgress"
import { getCDNImageUrl } from "@/utils/imageUtils"

function ProductGrid({ products, isLoading = false, gridCols = 5, onResetFilters }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((state) => state.access.isAuthenticated)
  const router = useNavigationProgress()

  console.log("ProductGrid received:", { count: products?.length, products, isLoading });

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="flex flex-col bg-white border border-border/5 rounded-xl overflow-hidden animate-pulse h-full shadow-sm">
      <div className="relative sm:h-56 bg-slate-200" />
      <div className="p-1 sm:p-2 flex flex-col flex-grow space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="mt-auto h-10 bg-slate-200 rounded" />
      </div>
    </div>
  )

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
    ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <div className={`grid ${gridColumnsClass} gap-4`}>
        {isLoading ? (
          // Show skeleton loaders while loading
          Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))
        ) : (
          // Show products when loaded
          products?.map((product) => (
          <div
            key={product.product_id}
            className="flex flex-col bg-white border border-border/5 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-200 text-foreground relative group h-full shadow-sm cursor-pointer transition-shadow duration-300"
            onClick={() => router.push(`/product/${product.product_id}`)}
          >
            {/* Deal Badge - Top Left */}
            {product.deal && (
              <div className="absolute top-48 left-2 z-20 pointer-events-none">
                <span className="inline-block text-white font-bold px-3 text-xs rounded-full bg-red-600 shadow-lg">
                  Sale
                </span>
              </div>
            )}

            {/* Image Container */}
            <div className="relative sm:h-56 overflow-hidden">
              <Image
                src={getCDNImageUrl(product.images[0]?.image) || "/placeholder.svg"}
                alt={product.name}
                fill
                style={{ objectFit: "contain" }}
                className="group-hover:opacity-90  md:py-4 transition-opacity duration-200"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                priority={false}
                loading="lazy"
                // width={500}
                // height={500}
                // style={{ height: '220px', width: 'auto' }}
                quality={80}
              />
            </div>

            {/* Content Container */}
            <div className="p-1 sm:p-2 flex flex-col flex-grow">
              {/* Product Title */}
              <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-3 leading-snug">
                {product.name}
              </h3>

              {/* Rating Section */}
              <div className="flex items-center gap-1 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(product.ratings.stats.avg_rating)
                          ? "text-yellow-400"
                          : "text-yellow-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs font-medium text-foreground ml-1">
                  {product.ratings.stats.avg_rating.toFixed(1)}
                </span>
              </div>

              {/* Price Section */}
              <div className="mb-4 pb-4 border-b border-border/5">
                <div className="flex items-baseline gap-2">
                  {product.old_price && (
                    <span className="text-xs line-through text-muted-foreground font-medium">
                      Rs {product.old_price.toLocaleString()}
                    </span>
                  )}
                  <span className="text-lg font-bold text-foreground">
                    Rs {product.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="sm"
                onClick={(e) => handleAddToCart(e, product)}
                className="text-xs sm:text-sm bg-foreground hover:bg-foreground/85 text-background w-full py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-semibold mt-auto"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
          ))
        )}

        {products?.length === 0 && !isLoading && (
          <div className="col-span-full">
            <div className="relative overflow-hidden rounded-xl border border-border/5 bg-gradient-to-b from-slate-50 to-slate-100 p-16 md:p-20 text-center">
              <SearchX className="h-16 w-16 text-muted-foreground mx-auto mb-5 opacity-40" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">No products found</h2>
              <p className="text-sm text-muted-foreground mb-10 max-w-sm mx-auto font-light">
                Try adjusting your filters or search to find what you're looking for
              </p>

              <div className="flex flex-col sm:flex-row gap-3 flex-wrap items-center justify-center">
                <Button
                  onClick={() => (onResetFilters ? onResetFilters() : router.push('/store'))}
                  className="bg-foreground hover:bg-foreground/85 text-background shadow-sm hover:shadow-md text-sm font-semibold px-6 py-2.5 rounded-lg transition-all duration-200"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default memo(ProductGrid)
"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { Heart, X, Star, Truck } from "lucide-react";
import CartSidebar from "@/components/cartSidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, sendCartToServer } from "@/redux/cartSlice";
import customFetch from "@/utils/customFetch";
import toast from "react-hot-toast";
import { useNavigationProgress } from "@/hooks/useNavigationProgress";
import { getLocalCart, setLocalCart } from "@/utils/localCart";
import { getCDNImageUrl, preloadImages } from "@/utils/imageUtils";

export default function ProductInteractive({ product }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const carouselApi = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Memoize color options to avoid recalculation
  const colorOptions = useMemo(() => {
    if (
      !product?.images ||
      !Array.isArray(product.images) ||
      product.images.length === 0
    )
      return [];
    return Array.from(
      new Map(
        product.images
          .filter((img) => img && img.color && (img.hex || img.color_name))
          .map((img) => [
            img.color,
            { color: img.color, color_name: img.color_name, hex: img.hex },
          ])
      ).values()
    );
  }, [product?.images]);

  const [selectedColor, setSelectedColor] = useState(null);

  // Default image - set directly without callback
  const defaultImageUrl = useMemo(() => {
    if (!product?.images || product.images.length === 0)
      return "/placeholder.svg";
    return getCDNImageUrl(product.images[0]?.image) || "/placeholder.svg";
  }, [product?.images]);

  const [selectedImage, setSelectedImage] = useState(defaultImageUrl);
  const [modalImage, setModalImage] = useState(null);
  const router = useNavigationProgress();

  // Get all unique images to enable sliding
  const allImages = useMemo(() => {
    if (!product?.images || !Array.isArray(product.images)) return [];
    return product.images.map(img => getCDNImageUrl(img.image)).filter(Boolean);
  }, [product?.images]);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  // Track carousel dragging to distinguish from clicks
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useCallback((e) => {
    setIsDragging(false);
  }, []);
  const dragMove = useCallback(() => {
    setIsDragging(true);
  }, []);
  const dragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Check if device is mobile - only run on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Local state for discussion comments
  const [comments, setComments] = useState(product.comments || []);
  const [newComment, setNewComment] = useState("");

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.access.isAuthenticated);

  // Defer image preloading to avoid blocking initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        product?.images &&
        Array.isArray(product.images) &&
        product.images.length > 0
      ) {
        const imageUrls = product.images
          .map((img) => img.image)
          .filter(Boolean);
        preloadImages(imageUrls);
      }
    }, 500); // Defer 500ms after initial render

    return () => clearTimeout(timer);
  }, [product?.images]);

  // When color changes, update selected image
  useEffect(() => {
    if (selectedColor && product?.images && product.images.length > 0) {
      const colorImg = product.images.find(
        (img) => img.color === selectedColor
      );
      if (colorImg) setSelectedImage(getCDNImageUrl(colorImg.image));
    }
  }, [selectedColor, product?.images]);

  const handleAddToCart = useCallback(() => {
    const cartItem = {
      product_id: product.product_id,
      price: product.price,
      image: getCDNImageUrl(product.images?.[0]?.image),
      name: product.name,
      quantity: 1,
    };

    dispatch(addToCart(cartItem));

    if (isLoggedIn) {
      dispatch(sendCartToServer(cartItem));
    } else {
      const localCart = getLocalCart();
      const existingIndex = localCart.findIndex(
        (item) => item.product_id === product.product_id
      );
      if (existingIndex !== -1) {
        // Increase quantity if already exists
        localCart[existingIndex].quantity += 1;
      } else {
        localCart.push(cartItem);
      }
      setLocalCart(localCart);
    }
    setIsCartOpen(true);
  }, [dispatch, isLoggedIn, product]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isLoggedIn) {
      toast.error("You need to be logged in to post a comment");
      return;
    }

    try {
      const response = await customFetch(
        `shop/api/comments/${product.product_id}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: product.product_id,
            text: newComment,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to post comment");
      }
      const postedComment = await response.json();
      setComments((prev) => [...prev, postedComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // Slider navigation handlers
  const handleGridImageClick = useCallback((clickedImage) => {
    const clickedIndex = allImages.indexOf(clickedImage);
    if (clickedIndex !== -1 && carouselApi.current) {
      carouselApi.current.scrollTo(clickedIndex);
      setCurrentImageIndex(clickedIndex);
      setSelectedImage(clickedImage);
    }
  }, [allImages]);

  return (
    <div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main className="mx-auto w-full px-4 py-8">
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="md:hidden space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-primary/60" />
                <span className="font-medium text-foreground">
                  {product.brandName}
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {product.name}
              </h2>
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.ratings.stats.avg_rating)
                        ? "text-yellow-600 fill-yellow-600"
                        : "text-gray-600 fill-gray-600"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-400">
                  ({product.ratings.stats.avg_rating.toFixed(1)})
                </span>
              </div>
            </div>
            <Carousel 
              className="w-full rounded-lg overflow-hidden bg-card/30"
              setApi={(api) => {
                carouselApi.current = api;
                if (api) {
                  api.on("select", () => {
                    setCurrentImageIndex(api.selectedIndex);
                    setSelectedImage(allImages[api.selectedIndex]);
                  });
                }
              }}
              onMouseDown={dragStartX}
              onMouseMove={dragMove}
              onMouseUp={dragEnd}
              onMouseLeave={dragEnd}
              onTouchStart={dragStartX}
              onTouchMove={dragMove}
              onTouchEnd={dragEnd}
            >
              <CarouselContent className="h-60 md:h-[70vh]">
                {allImages.map((img, idx) => (
                  <CarouselItem key={idx} className="flex items-center justify-center">
                    <div 
                      className="relative w-full h-full cursor-pointer"
                      onClick={() => {
                        if (!isDragging) {
                          setModalImage(img);
                        }
                      }}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - ${idx + 1}`}
                        fill
                        className="object-contain p-4 pointer-events-none"
                        priority={idx === 0}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {allImages.length > 1 && (
                <>
                  <CarouselPrevious className="left-4 bg-black/50 hover:bg-black/70 text-white border-0 h-10 w-10" />
                  <CarouselNext className="right-4 bg-black/50 hover:bg-black/70 text-white border-0 h-10 w-10" />
                </>
              )}
            </Carousel>
            <div className="grid grid-cols-4">
              {(() => {
                let coloredImage = false;
                return (product.images || [])
                  .filter((img) => {
                    if (!img.color)
                      return true;
                    else {
                      if (!coloredImage) {
                        coloredImage = true;
                        return true;
                      }
                      return false;
                    }
                    return false;
                  })
                  .map((img, i) => {
                    const cdnImageUrl = getCDNImageUrl(img.image);
                    return (
                      <div
                        key={cdnImageUrl + i}
                        className={`relative aspect-square overflow-hidden border ${
                          allImages[currentImageIndex] === cdnImageUrl
                            ? "border-primary shadow-md"
                            : "border-border"
                        } bg-card/50 backdrop-blur-sm hover:scale-105 cursor-pointer transition-all duration-200 hover:shadow-md`}
                        onClick={() => handleGridImageClick(cdnImageUrl)}
                      >
                        <Image
                          src={cdnImageUrl || "/placeholder.svg"}
                          alt={`${product.name} - Image ${i + 1}`}
                          fill
                          className="object-contain"
                          loading={i < 4 ? "eager" : "lazy"}
                          sizes="(max-width: 768px) 25vw, 12vw"
                        />
                      </div>
                    );
                  });
              })()}
            </div>
            {/* Cool Attributes Table */}
            {product?.attributes && product.attributes.length > 0 && (
              <div className="mt-8 hidden md:block">
                <h2 className="text-2xl font-bold mb-4 text-primary text-center">
                  Product Attributes
                </h2>
                <div className="overflow-hidden rounded-lg shadow-modern border border-border">
                  <table className="min-w-full bg-card">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                          Key
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(product.attributes || []).map(
                        (attr, index) =>
                          attr.value && (
                            <tr
                              key={index}
                              className="hover:bg-accent/50 transition-colors duration-200"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                                {attr.attribute}
                              </td>
                              <td className="px-6 py-4 text-sm text-foreground">
                                {attr.value}
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* End of Attributes Table */}
          </div>

          {/* Product Details */}
          <div className="space-y-2 md:space-y-6">
            <div className="space-y-2 hidden md:block">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-primary/60" />
                <span className="font-bold text-foreground">
                  {product.brandName}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {product.name}
              </h2>
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.ratings.stats.avg_rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground fill-muted-foreground"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground">
                  ({product.ratings.stats.avg_rating.toFixed(1)})
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              {product.before_deal_price && (
                <strike className="text-xl md:text-sm text-amber-600 font-bold">
                  RS. {product.before_deal_price?.toFixed(2)}
                </strike>
              )}
              {product.old_price && (
                <strike className="text-xl md:text-sm text-muted-foreground font-bold">
                  RS. {product.old_price?.toFixed(2)}
                </strike>
              )}
              <div className="text-xl md:text-2xl text-primary font-bold">
                RS. {product.price.toFixed(2)}
              </div>
            </div>

            {colorOptions.length > 0 && (
              <div className="mt-4 mb-4">
                <span className="text-sm font-semibold text-foreground block mb-3">
                  Choose Colour
                </span>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.color}
                      className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 transition-all duration-150 focus:outline-none ${
                        selectedColor === opt.color
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary bg-card"
                      }`}
                      title={opt.color_name || "Color"}
                      aria-label={opt.color_name || "Color"}
                      onClick={() => setSelectedColor(opt.color)}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 border-gray-300"
                        style={{
                          background:
                            opt.hex ||
                            (opt.color_name
                              ? opt.color_name.toLowerCase()
                              : "#eee"),
                        }}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {opt.color_name || "Color"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )} 

            {/* Choose Size */}
            <div className="mt-4 mb-4">
              <span className="text-sm font-semibold text-foreground block mb-3">
                Choose Size
              </span>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg border-2 border-primary bg-primary/10 font-medium text-foreground">
                  256GB
                </button>
                <button className="px-4 py-2 rounded-lg border-2 border-border hover:border-primary bg-card font-medium text-foreground">
                  512GB
                </button>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-foreground">Quantity</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-muted transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center border-0 bg-transparent focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-muted transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-2 bg-card/50 border border-border rounded-lg p-4 md:space-x-4 shadow-sm">
                <Button
                  className="w-64 bg-foreground shadow-md hover:bg-foreground/90 "
                  size="lg"
                  onClick={handleAddToCart}
                >
                  Add to cart
                </Button>
                <Button
                  variant="outline"
                  className="border border-gray-300 shadow-md w-64 flex hidden md:block hover:bg-accent"
                  size="lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                  <Heart
                    size={20}
                    className="text-destructive hover:text-destructive/80"
                    fill="currentColor"
                    />
                    <p>Add to WishList</p>
                    </div>
                </Button>
              </div>
            </div>

            <div className="flex items-center text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <Truck className="w-4 h-4 mr-2" />
              <span className="font-medium">
                Free delivery on orders over RS. 150
              </span>
            </div>

            {product?.attributes && product.attributes.length > 0 && (
              <div className="mt-8 block md:hidden">
                <h2 className="text-2xl font-bold mb-4 text-red-500">
                  Product Attributes
                </h2>
                <div className="overflow-hidden rounded-lg shadow-modern border border-border">
                  <table className="min-w-full bg-card">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                          Key
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(product.attributes || []).map(
                        (attr, index) =>
                          attr.value && (
                            <tr key={index} className="">
                              <td className="px-6 py-4 whitespace-nowrap text-sm ">
                                {attr.attribute}
                              </td>
                              <td className="px-6 py-4 text-sm ">
                                {attr.value}
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tabs for additional information */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50 border border-border text-foreground">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger
                  value="discussion"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                >
                  Discussion
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className=" space-y-4 mt-4">
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4 mt-4">
                {/* Aggregated Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">
                      {product.ratings.stats.avg_rating}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(product.ratings.stats.avg_rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-600 fill-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.ratings.stats.total_ratings} reviews
                  </span>
                </div>

                {/* Rating Distribution Bars */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const widthPercent =
                      product.ratings.stats.total_ratings > 0
                        ? (product.ratings.stats.rating_dict[star] /
                            product.ratings.stats.total_ratings) *
                          100
                        : 0;
                    return (
                      <div key={star} className="flex items-center space-x-2">
                        <span className="w-4">{star}</span>
                        <div className="flex-1 h-2 bg-gray-500 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{ width: `${widthPercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* List of Individual Rating Reviews */}
                {product.ratings.data && product.ratings.data.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {product.ratings.data.map((rate) => (
                      <div
                        key={rate.id}
                        className="bg-gray-900 text-white rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          {!rate.user_dp && (
                            <Avatar>
                              <AvatarFallback className="bg-black">
                                {rate.user[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          {rate.user_dp && (
                            <Image
                              src={rate.user_dp}
                              alt="User avatar"
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium">{rate.user}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < rate.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-600 fill-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {rate.comment && <p className="">{rate.comment}</p>}
                        {/* Display the image thumbnail if available */}
                        {rate.image && (
                          <div className="mt-2">
                            <Image
                              src={rate.image}
                              alt="Review image"
                              width={400}
                              height={300}
                              className="object-cover rounded cursor-pointer"
                              onClick={() => setModalImage(rate.image)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Discussion Tab */}
              <TabsContent value="discussion" className="space-y-1 mt-4">
                {/* Display Comments */}
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-900 text-white rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-start space-x-4">
                      {!comment.user_dp && (
                        <Avatar>
                          <AvatarFallback className="bg-black">
                            {comment.user[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {comment.user_dp && (
                        <Image
                          src={comment.user_dp}
                          alt="User"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <div className="flex-1 space-y-1">
                        <p className="font-medium ">{comment.user}</p>
                        <p className="text-sm text-white/50">
                          {new Date(
                            comment.published_date
                          ).toLocaleDateString()}
                        </p>
                        <p className="">{comment.text}</p>
                      </div>
                    </div>
                    {comment?.replies && comment.replies.length > 0 && (
                      <div className="ml-12 space-y-4">
                        {comment.replies.map((reply, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-4"
                          >
                            {!reply.user_dp && (
                              <Avatar>
                                <AvatarFallback className="bg-black">
                                  {reply.user[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            {reply.user_dp && (
                              <Image
                                src={reply.user_dp}
                                alt="User"
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                            )}
                            <div className="flex-1 space-y-1">
                              <p className="font-medium ">{reply.user}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(
                                  reply.published_date
                                ).toLocaleDateString()}
                              </p>
                              <p className="">{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {/* Comment Form */}
                <div className=" rounded-lg p-4">
                  <form
                    onSubmit={handleCommentSubmit}
                    className="flex flex-col"
                  >
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-2 rounded border  text-white"
                      placeholder="Write your comment..."
                    />
                    <Button
                      type="submit"
                      className="mt-2 bg-red-700 hover:bg-red-700"
                    >
                      Post Comment
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Amazon-style Zoom Window (Desktop only) - Modal Overlay */}
        </div>
        {/* Modal for enlarged image - Fullscreen Slideshow */}
        {modalImage && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setModalImage(null)}
          >
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50 p-2 bg-black/40 hover:bg-black/60 rounded-full"
                onClick={() => setModalImage(null)}
                aria-label="Close image"
              >
                <X size={28} />
              </button>

              {/* Carousel for Modal */}
              <Carousel className="w-full max-w-4xl" opts={{ loop: true }}>
                <CarouselContent>
                  {allImages.map((img, idx) => (
                    <CarouselItem key={idx} className="flex items-center justify-center">
                      <div className="relative w-full aspect-square md:aspect-auto md:h-[100vh] flex items-center justify-center">
                        <Image
                          src={img}
                          alt={`Image ${idx + 1}`}
                          fill
                          className="object-contain p-4"
                          priority={idx === 0}
                          sizes="(max-width: 768px) 100vw, 80vw"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {allImages.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4 bg-black/50 hover:bg-black/70 text-white border-0 h-12 w-12" />
                    <CarouselNext className="right-4 bg-black/50 hover:bg-black/70 text-white border-0 h-12 w-12" />
                  </>
                )}
              </Carousel>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

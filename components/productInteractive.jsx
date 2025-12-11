"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, X, Star, Truck, Search } from "lucide-react";
import CartSidebar from "@/components/cartSidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, sendCartToServer } from "@/redux/cartSlice";
import customFetch from "@/utils/customFetch";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getLocalCart, setLocalCart } from "@/utils/localCart";
import { getCDNImageUrl, preloadImages } from "@/utils/imageUtils";
import { useEffect } from "react";


export default function ProductInteractive({ product }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Color selection state
  // Find all unique color options from images
  const colorOptions = Array.from(
    new Map(
      product.images
        .filter((img) => img.color && (img.hex || img.color_name))
        .map((img) => [img.color, { color: img.color, color_name: img.color_name, hex: img.hex }])
    ).values()
  );

  // If there are color options, default to the first color; else null
  const [selectedColor, setSelectedColor] = useState(null);

  // Default selected image: first image, or first of selected color if set
  const getDefaultImage = () => {
    if (selectedColor) {
      const colorImg = product.images.find((img) => img.color === selectedColor);
      if (colorImg) return getCDNImageUrl(colorImg.image);
    }
    return getCDNImageUrl(product.images[0]?.image) || "/placeholder.svg";
  };
  const [selectedImage, setSelectedImage] = useState(getDefaultImage());
  const [modalImage, setModalImage] = useState(null);
  const router = useRouter();

  // Amazon-style zoom states
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Local state for discussion comments
  const [comments, setComments] = useState(product.comments || []);
  const [newComment, setNewComment] = useState("");

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.access.isAuthenticated);

  // Preload all product images for instant switching - super fast UX
  useEffect(() => {
    if (product.images && product.images.length > 0) {
      const imageUrls = product.images.map(img => img.image);
      preloadImages(imageUrls);
    }
  }, [product.images]);

  // When color changes, update selected image to first image of that color
  useEffect(() => {
    if (selectedColor) {
      const colorImg = product.images.find((img) => img.color === selectedColor);
      if (colorImg) setSelectedImage(getCDNImageUrl(colorImg.image));
    }
    // If color is cleared, do not change selectedImage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor]);

  const handleAddToCart = () => {
    const cartItem = {
      product_id: product.product_id,
      price: product.price,
      image: getCDNImageUrl(product.images[0]?.image),
      name: product.name,
      quantity: 1,
    };

    dispatch(addToCart(cartItem));

    if (isLoggedIn) {
      dispatch(sendCartToServer(cartItem));
    }
    else{
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
    setIsCartOpen(true);
  };

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

  // Amazon-style zoom handlers (desktop only)
  const handleMouseEnter = () => {
    if (!isMobile) {
      setShowZoom(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setShowZoom(false);
    }
  };

  const handleMouseMove = (e) => {
    if (isMobile) return;
    
    const element = e.currentTarget;
    const { top, left, width, height } = element.getBoundingClientRect();
    
    // Calculate mouse position relative to the image (0-100%)
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };

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
                <span className="font-medium text-foreground">{product.brandName}</span>
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
            <div
              className={`relative w-auto h-auto min-h-60 md:min-h-96 rounded-lg overflow-hidden border border-gray-800 bg-inherit backdrop-blur-sm p-4 group ${
                isMobile ? "cursor-pointer" : "cursor-crosshair"
              }`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              onClick={isMobile ? () => setModalImage(selectedImage) : undefined}
            >
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain md:object- mr-4"
                priority={true} // Load main image immediately for fast LCP
                sizes="(max-width: 768px) 100vw, 50vw" // Responsive sizing for performance
              />
              
              {/* Zoom indicator */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card/80 backdrop-blur-sm text-foreground p-2 rounded-full border border-border shadow-sm">
                <Search className="w-4 h-4" />
                <span className="sr-only">
                  {isMobile ? 'Tap to enlarge' : 'Hover to zoom'}
                </span>
              </div>
              
              {/* Amazon-style Lens Overlay */}
              {showZoom && !isMobile && (
                <div
                  className="absolute pointer-events-none border border-gray-900 bg-white bg-opacity-20 backdrop-blur-sm transition-all duration-75 ease-out shadow-lg"
                  style={{
                    width: '120px',
                    height: '120px',
                    left: `${Math.max(10, Math.min(zoomPosition.x, 90))}%`,
                    top: `${Math.max(10, Math.min(zoomPosition.y, 90))}%`,
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '6px',
                  }}
                />
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {(() => {
                let coloredImage = false;
                // Show all images without a color attribute, and only the first image for each color
                const seenColors = new Set();
                return product.images
                  .filter((img) => {
                    if (!img.color) return true; // show all images without color
                    else {
                      if (!coloredImage) {
                        coloredImage = true;
                        return true; // show first image for this color
                      }
                      return false;
                    }
                    return false; // skip subsequent images with same color
                  })
                  .map((img, i) => {
                    const cdnImageUrl = getCDNImageUrl(img.image);
                    return (
                      <div
                        key={cdnImageUrl + i}
                        className={`relative aspect-square rounded-lg overflow-hidden border ${
                          selectedImage === cdnImageUrl
                            ? "border-primary shadow-md"
                            : "border-border"
                        } bg-card/50 backdrop-blur-sm hover:border-primary cursor-pointer transition-all duration-200 hover:shadow-md`}
                        onMouseEnter={() => setSelectedImage(cdnImageUrl)}
                        onClick={() => setSelectedImage(cdnImageUrl)}
                      >
                        <Image
                          src={cdnImageUrl || "/placeholder.svg"}
                          alt={`${product.name} - Image ${i + 1}`}
                          fill
                          className="object-cover"
                          loading={i < 4 ? "eager" : "lazy"}
                          sizes="(max-width: 768px) 25vw, 12vw"
                        />
                      </div>
                    );
                  });
              })()}
            </div>
             {/* Cool Attributes Table */}
             {product.attributes.length > 0 && (
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
                    {product.attributes.map((attr, index) => (
                      attr.value && (
                      <tr key={index} className="hover:bg-accent/50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                          {attr.attribute}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {attr.value}
                        </td>
                      </tr>
                      )
                    ))}
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
                <span className="font-medium text-foreground">{product.brandName}</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground">
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
            <div className="flex gap-3">
            <div className="text-xl md:text-3xl text-primary font-bold">
              RS. {product.price.toFixed(2)}
            </div>
            {product.before_deal_price && (
            <strike className="text-xl md:text-2xl text-amber-600 font-bold">
              RS. {product.before_deal_price?.toFixed(2)}
            </strike>
            )}
            {product.old_price && (
            <strike className="text-xl md:text-2xl text-muted-foreground font-bold">
              RS. {product.old_price?.toFixed(2)}
            </strike>
              )}

            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className=" font-bold">
                  Category: {product.category}
                </p>
                <p className="text-muted-foreground font-bold">Series: {product.series}</p>
              </div>
            </div>
            {/* Color Picker below main image */}
            {colorOptions.length > 0 && (
              <div className="flex items-center gap-3 mt-4 mb-2">
                <span className="text-sm font-semibold text-black">Pick a color:</span>
                {colorOptions.map((opt) => (
                  <button
                    key={opt.color}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-150 focus:outline-none ${
                      selectedColor === opt.color
                        ? "border-primary ring-2 ring-primary"
                        : "border-gray-300 hover:border-primary"
                    }`}
                    style={{ background: opt.hex || (opt.color_name ? opt.color_name.toLowerCase() : "#eee") }}
                    title={opt.color_name || "Color"}
                    aria-label={opt.color_name || "Color"}
                    onClick={() => setSelectedColor(opt.color)}
                  >
                    {selectedColor === opt.color && (
                      <span className="  bg-white/30" />
                    )}
                  </button>
                ))}
                {/* Show color name of selected */}
                <span className="ml-2 text-xs font-bold text-foreground">
                  {colorOptions.find((c) => c.color === selectedColor)?.color_name}
                </span>
              </div>
            )}



            <div className="flex space-x-2 bg-card/50 border border-border rounded-lg p-4 md:space-x-4 shadow-sm">
              <Button
                className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 btn-futuristic shadow-sm hover:shadow-md transition-all duration-200"
                size="lg"
                // onClick={() => router.push("/product/emi/" + product.product_id)}
              >
                Apply EMI
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 btn-futuristic shadow-sm hover:shadow-md transition-all duration-200"
                size="lg"
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>
              <Button
                variant="outline"
                className="border-border hidden md:block hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                aria-label="Add to wishlist"
              >
                <Heart
                  size={64}
                  className="text-destructive hover:text-destructive/80"
                  fill="currentColor"
                />
              </Button>
            </div>

            <div className="flex items-center text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <Truck className="w-4 h-4 mr-2" />
              <span className="font-medium">Free delivery on orders over RS. 150</span>
            </div>

            {product.attributes.length > 0 && (
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
                    {product.attributes.map((attr, index) => (
                      attr.value &&(
                      <tr key={index} className="">
                        <td className="px-6 py-4 whitespace-nowrap text-sm ">
                          {attr.attribute}
                        </td>
                        <td className="px-6 py-4 text-sm ">
                          {attr.value}
                        </td>
                      </tr>)

                    ))}
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
                {product.ratings.data &&
                  product.ratings.data.length > 0 && (
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
                              <span className="font-medium">
                                {rate.user}
                              </span>
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
                          {rate.comment && (
                            <p className="">{rate.comment}</p>
                          )}
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
                        <p className="font-medium ">
                          {comment.user}
                        </p>
                        <p className="text-sm text-white/50">
                          {new Date(comment.published_date).toLocaleDateString()}
                        </p>
                        <p className="">{comment.text}</p>
                      </div>
                    </div>
                    {comment.replies.length > 0 && (
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
                              <p className="font-medium ">
                                {reply.user}
                              </p>
                              <p className="text-sm text-gray-400">
                                {new Date(reply.published_date).toLocaleDateString()}
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
                    <Button type="submit" className="mt-2 bg-red-700 hover:bg-red-700">
                      Post Comment
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>

          </div>

          {/* Amazon-style Zoom Window (Desktop only) - Modal Overlay */}
          {showZoom && !isMobile && (
            <div className="fixed inset-0 pointer-events-none z-50">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-black bg-opacity-20 backdrop-blur-sm">
                <div className="flex items-center justify-center h-full p-8">
                  <div className="w-full max-w-lg h-96 border-2 border-gray-600 rounded-lg overflow-hidden bg-white shadow-2xl pointer-events-auto">
                    <div
                      className="w-full h-full transition-all duration-75 ease-out"
                      style={{
                        backgroundImage: `url(${selectedImage})`,
                        backgroundSize: '400%',
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                  </div>
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-auto">
                  <p className="text-white text-sm font-medium drop-shadow-lg">
                    🔍 Zoomed View
                  </p>
                  <p className="text-gray-300 text-xs drop-shadow-lg">
                    Move mouse over image to zoom
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Modal for enlarged image */}
        {modalImage && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50"
            onClick={() => setModalImage(null)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                className="absolute top-2 right-2 text-white z-10"
                onClick={() => setModalImage(null)}
              >
                <X size={24} />
              </button>
              <Image
                src={modalImage}
                alt="Enlarged review image"
                width={800}
                height={600}
                className="object-contain rounded"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

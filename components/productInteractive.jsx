"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, X, Star, Truck } from "lucide-react";
import CartSidebar from "@/components/cartSidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, sendCartToServer } from "@/redux/cartSlice";
import customFetch from "@/utils/customFetch";


export default function ProductInteractive({ product }) {
    console.log(product)
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    product.images[0]?.image || "/placeholder.svg"
  );
const [modalImage, setModalImage] = useState(null);

  
  
  // Local state for discussion comments
  const [comments, setComments] = useState(product.comments || []);
  const [newComment, setNewComment] = useState("");

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.access.isAuthenticated);

  const handleAddToCart = () => {
    const cartItem = {
      product_id: product.product_id,
      price: product.price,
      image: product.images[0]?.image,
      name: product.name,
      quantity: 1,
    };

    dispatch(addToCart(cartItem));

    if (isLoggedIn) {
      dispatch(sendCartToServer(cartItem));
    }
    setIsCartOpen(true);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

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

  return (
    <div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative w-full h-96 rounded-lg overflow-hidden border border-gray-800 bg-black/50 backdrop-blur-sm">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className={`relative aspect-square rounded-lg overflow-hidden border ${
                    selectedImage === img.image
                      ? "border-pink-500"
                      : "border-gray-800"
                  } bg-black/50 backdrop-blur-sm hover:border-pink-500 cursor-pointer transition-colors`}
                  onMouseEnter={() => setSelectedImage(img.image)}
                >
                  <Image
                    src={img.image || "/placeholder.svg"}
                    alt={`${product.name} - Image ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6 text-white">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500" />
                <span className="font-medium">{product.brandName}</span>
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                {product.name}
              </h1>
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

            <div className="text-3xl font-bold">
              ${product.price.toFixed(2)}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-gray-300">Category: {product.category}</p>
                <p className="text-gray-300">Series: {product.series}</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
                size="lg"
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>
              <Button
                variant="outline"
                className="border-gray-800 hover:text-white transition-colors"
              >
                <Heart
                  size={64}
                  className="text-red-500 hover:text-black"
                  fill="currentColor"
                />
              </Button>
            </div>

            <div className="flex items-center text-sm text-gray-400">
              <Truck className="w-4 h-4 mr-2" />
              Free delivery on orders over $150
            </div>

            {/* Tabs for additional information */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-gray-800">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-pink-500"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-pink-500"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger
                  value="discussion"
                  className="data-[state=active]:bg-pink-500"
                >
                  Discussion
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="details"
                className="text-gray-300 space-y-4 mt-4"
              >
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
                  className="bg-black/30 rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarFallback className="bg-black">
                        {rate.user[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-white">
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
                    <p className="text-gray-300">{rate.comment}</p>
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

      {/* Modal for enlarged image */}
      {modalImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
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
    

              {/* Discussion Tab */}
              <TabsContent value="discussion" className="space-y-1 mt-4">
                {/* Display Comments */}
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-black/30 rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-black">
                          {comment.user[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-white">
                          {comment.user}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(comment.published_date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-300">{comment.text}</p>
                      </div>
                    </div>
                    {comment.replies.length > 0 && (
                      <div className="ml-12 space-y-4">
                        {comment.replies.map((reply, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-4"
                          >
                            <Avatar>
                              <AvatarFallback className="bg-black">
                                {reply.user[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <p className="font-medium text-white">
                                {reply.user}
                              </p>
                              <p className="text-sm text-gray-400">
                                {new Date(reply.published_date).toLocaleDateString()}
                              </p>
                              <p className="text-gray-300">{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {/* Comment Form */}
                <div className="bg-black/30 rounded-lg p-4">
                  <form onSubmit={handleCommentSubmit} className="flex flex-col">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white"
                      placeholder="Write your comment..."
                    />
                    <Button
                      type="submit"
                      className="mt-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
                    >
                      Post Comment
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

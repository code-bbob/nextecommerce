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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProductInteractive({ product }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    product.images[0]?.image || "/placeholder.svg"
  );
  const [modalImage, setModalImage] = useState(null);
  const router = useRouter();

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

  return (
    <div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main className="mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="md:hidden space-y-4">

          <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500" />
                <span className="font-medium">{product.brandName}</span>
              </div>
          <h1 className="text-3xl font-bold bg-clip-text text-white/70">
                {product.name}
              </h1>
            </div>
            <div className="relative w-full h-96 rounded-lg overflow-hidden border border-gray-800 bg-inherit backdrop-blur-sm p-4">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain mr-4"
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
             {/* Cool Attributes Table */}
             {product.attributes.length > 0 && (
             <div className="mt-8 hidden md:block">
              <h2 className="text-2xl font-bold mb-4 text-gray-300 text-center">
                Product Attributes
              </h2>
              <div className="overflow-hidden rounded-lg shadow-lg">
                <table className="min-w-full ">
                  <thead className="bg-black/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Key
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {product.attributes.map((attr, index) => (
                      attr.value && (
                      <tr key={index} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm ">
                          {attr.attribute}
                        </td>
                        <td className="px-6 py-4  text-sm">
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
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500" />
                <span className="font-medium">{product.brandName}</span>
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-white/70">
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
            <div className="flex gap-3">
            <div className="text-3xl text-orange-500 font-bold">
              RS. {product.price.toFixed(2)}
            </div>
            {product.old_price && (
            <strike className="text-2xl text-grey-600 font-bold">
              RS. {product.old_price?.toFixed(2)}
            </strike>
              )}

            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-gray-300 font-bold">
                  Category: {product.category}
                </p>
                <p className="text-gray-300 font-bold">Series: {product.series}</p>
              </div>
            </div>

            <div className="flex space-x-2 bg-gray-600 rounded p-4 md:space-x-4">
              <Button
                className="flex-1 bg-black text-md hover:scale-105"
                size="lg"
                onClick={() => router.push("/product/emi/" + product.product_id)}
              >
                Apply Emi
              </Button>
              <Button
                className="flex-1 bg-red-500 text-md hover:bg-red-700 hover:scale-105"
                size="lg"
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>
              <Button
                variant="outline"
                className="border-gray-800 hidden md:block   hover:text-white transition-colors"
              >
                <Heart
                  size={64}
                  className="text-red-500 hover:text-black"
                  fill="currentColor"
                />
              </Button>
            </div>

            <div className="flex items-center text-sm">
              <Truck className="w-4 h-4 mr-2" />
              Free delivery on orders over RS. 150
            </div>

            {product.attributes.length > 0 && (
             <div className="mt-8 block md:hidden">
              <h2 className="text-2xl font-bold mb-4 text-red-500">
                Product Attributes
              </h2>
              <div className="overflow-hidden rounded-lg shadow-lg">
                <table className="min-w-full ">
                  <thead className="bg-black/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                        Key
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
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
              <TabsList className="grid w-full grid-cols-3 bg-black/50 border text-white border-gray-800">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger
                  value="discussion"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  Discussion
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="text-white/70 space-y-4 mt-4">
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
                <div className="bg-gray-900 rounded-lg p-4">
                  <form
                    onSubmit={handleCommentSubmit}
                    className="flex flex-col"
                  >
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-2 rounded border border-gray-700 bg-gray-900 text-white"
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

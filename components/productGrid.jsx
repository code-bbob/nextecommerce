"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductGrid({products}) {
    // const products = [
    //     {
    //         "product_id": "f5ce01f7-4622-4b78-98f1-97497656e439",
    //         "comments": [],
    //         "images": [
    //             {
    //                 "image": "http://127.0.0.1:8000/media/shop/images/IMG-20240823-WA0006.jpg"
    //             }
    //         ],
    //         "rating": 0,
    //         "name": "NVIDIA 4090 GPU",
    //         "category": "gpu",
    //         "brandName": "Nvidia",
    //         "series": "4090",
    //         "price": 1000,
    //         "description": "<p>dami xa</p>",
    //         "published_date": "2025-02-24"
    //     },
    //     {
    //         "product_id": "f5ce01f7-4622-4b78-98f-97497656e439",
    //         "comments": [],
    //         "images": [
    //             {
    //                 "image": "http://127.0.0.1:8000/media/shop/images/IMG-20240823-WA0006.jpg"
    //             }
    //         ],
    //         "rating": 0,
    //         "name": "NVIDIA 4090 GPU",
    //         "category": "gpu",
    //         "brandName": "Nvidia",
    //         "series": "4090",
    //         "price": 1000,
    //         "description": "<p>dami xa</p>",
    //         "published_date": "2025-02-24"
    //     },
    //     {
    //         "product_id": "f5ce01f7-622-4b78-98f1-97497656e439",
    //         "comments": [],
    //         "images": [
    //             {
    //                 "image": "http://127.0.0.1:8000/media/shop/images/IMG-20240823-WA0006.jpg"
    //             }
    //         ],
    //         "rating": 0,
    //         "name": "NVIDIA 4090 GPU",
    //         "category": "gpu",
    //         "brandName": "Nvidia",
    //         "series": "4090",
    //         "price": 1000,
    //         "description": "<p>dami xa</p>",
    //         "published_date": "2025-02-24"
    //     },
    //     {
    //         "product_id": "f5ce1f7-4622-4b78-98f1-97497656e439",
    //         "comments": [],
    //         "images": [
    //             {
    //                 "image": "http://127.0.0.1:8000/media/shop/images/IMG-20240823-WA0006.jpg"
    //             }
    //         ],
    //         "rating": 0,
    //         "name": "NVIDIA 4090 GPU",
    //         "category": "gpu",
    //         "brandName": "Nvidia",
    //         "series": "4090",
    //         "price": 1000,
    //         "description": "<p>dami xa</p>",
    //         "published_date": "2025-02-24"
    //     },
    //     {
    //         "product_id": "f5ce01f7-4622-4b78-98f1-9749656e439",
    //         "comments": [],
    //         "images": [
    //             {
    //                 "image": "http://127.0.0.1:8000/media/shop/images/IMG-20240823-WA0006.jpg"
    //             }
    //         ],
    //         "rating": 0,
    //         "name": "NVIDIA 4090 GPU",
    //         "category": "gpu",
    //         "brandName": "Nvidia",
    //         "series": "4090",
    //         "price": 1000,
    //         "description": "<p>dami xa</p>",
    //         "published_date": "2025-02-24"
    //     },
    //     {
    //         "product_id": "f5ce01f7-4622-4b78-98f1-97497656e9",
    //         "comments": [],
    //         "images": [
    //             {
    //                 "image": "http://127.0.0.1:8000/media/shop/images/IMG-20240823-WA0006.jpg"
    //             }
    //         ],
    //         "rating": 0,
    //         "name": "NVIDIA 4090 GPU",
    //         "category": "gpu",
    //         "brandName": "Nvidia",
    //         "series": "4090",
    //         "price": 1000,
    //         "description": "<p>dami xa</p>",
    //         "published_date": "2025-02-24"
    //     }
    // ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products?.map((product) => (
        <motion.div
          key={product.product_id}
          className="bg-gradient-to-br from-black via-gray-800 to-black backdrop-blur-md rounded-lg overflow-hidden shadow-lg"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
           <div className="relative h-48 overflow-hidden">
            <Image
              src={product.images[0]?.image || "/placeholder.svg"}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              className="transition-transform duration-300 hover:scale-110"
            />
            <Badge className="absolute top-2 right-2 font-bold bg-red-800">{product.category?.toLocaleUpperCase()}</Badge>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-white">{product.name}</h3>
            <div className="flex items-center mb-2">
              <Star className="text-yellow-400 mr-1 h-4 w-4" />
              <span className="text-sm text-gray-300">{product.rating.toFixed(1)}</span>
            </div>
            <p className="text-xl font-bold mb-4 text-green-400">${product.price.toFixed(2)}</p>
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" className=" text-white border-black bg-gradient-to-r from-black via-gray-600 to-black hover:bg-gradient-to-r hover:from-gray-400 hover:via-black hover:to-gray-400 hover:text-white">
                <Eye className="mr-2 h-4 w-4" /> View
              </Button>
              <Button size="sm" className="bg-green-800 hover:bg-green-700 text-white">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
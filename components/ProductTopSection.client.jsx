"use client";

import { useState } from "react";

import ProductActions from "@/components/ProductActions.client";
import ProductImageCarousel from "@/components/ProductImageCarousel.client";

function Stars({ value = 0 }) {
  const rounded = Math.round(Number(value) || 0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < rounded ? "text-yellow-600" : "text-muted-foreground/40"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductTopSection({ product }) {
  const avgRating = product?.ratings?.stats?.avg_rating ?? 0;
  const totalRatings = product?.ratings?.stats?.total_ratings ?? 0;
  const [selectedColorId, setSelectedColorId] = useState(null);

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 px-4 auto-rows-max">
      <div className="space-y-4">
        <ProductImageCarousel
          productName={product?.name}
          images={product?.images || []}
          activeColorId={selectedColorId}
        />
      </div>

      <div className="">
        <div className="space-y-2">
          {product?.brandName && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-primary/60" />
              <span className="font-bold text-foreground">{product.brandName}</span>
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {product?.name} - Price in Nepal | Buy Online
          </h1>

          {product?.seriesName && (
            <h2 className="text-lg font-semibold text-orange-500">
              {product.seriesName} series
            </h2>
          )}

          {product?.stock != null && (
            <div className="text-sm my-4 text-black">
              <span className="font-bold">In Stock:</span> {product.stock}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Stars value={avgRating} />
            <span className="text-sm text-muted-foreground">
              {Number(avgRating).toFixed(1)} ({totalRatings} reviews)
            </span>
          </div>
        </div>

        <ProductActions
          product={product}
          selectedColorId={selectedColorId}
          onColorSelect={setSelectedColorId}
        />

        {product?.description && (
          <section className="space-y-3 mt-10">
            <h3 className="text-lg font-semibold text-foreground">Product Details</h3>
            <div
              className="prose max-w-none text-sm text-foreground/90"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </section>
        )}
      </div>
    </div>
  );
}

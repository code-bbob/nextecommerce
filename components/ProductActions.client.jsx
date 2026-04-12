"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";

import CartSidebar from "@/components/cartSidebar";
import { Button } from "@/components/ui/button";
import { addToCart, sendCartToServer } from "@/redux/cartSlice";
import { getLocalCart, setLocalCart } from "@/utils/localCart";
import { getCDNImageUrl } from "@/utils/imageUtils";

export default function ProductActions({ product, selectedColorId = null, onColorSelect }) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.access.isAuthenticated);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Derive unique color options from images (images have color id, color_name, hex)
  const colorOptions = useMemo(() => {
    if (!Array.isArray(product?.images)) return [];
    return Array.from(
      new Map(
        product.images
          .filter((img) => img?.color != null && img?.color_name)
          .map((img) => [
            img.color,
            { id: img.color, name: img.color_name, hex: img.hex },
          ])
      ).values()
    );
  }, [product?.images]);

  // Also support top-level colors array (ColorSerializer: id, name, hex)
  const colors = useMemo(() => {
    if (colorOptions.length > 0) return colorOptions;
    if (!Array.isArray(product?.colors)) return [];
    return product.colors.map((c) => ({ id: c.id, name: c.name, hex: c.hex }));
  }, [colorOptions, product?.colors]);

  const variants = useMemo(() => {
    if (!Array.isArray(product?.variants)) return [];
    return product.variants;
  }, [product?.variants]);

  const [selectedColor, setSelectedColor] = useState(() => {
    if (selectedColorId != null) {
      const matched = colors.find((c) => c.id === selectedColorId);
      if (matched) return matched;
    }
    return colors[0] ?? null;
  });
  const [selectedVariant, setSelectedVariant] = useState(() => variants[0] ?? null);

  useEffect(() => {
    if (!colors.length) return;
    if (selectedColorId == null) {
      setSelectedColor((prev) => prev ?? colors[0]);
      return;
    }
    const matched = colors.find((c) => c.id === selectedColorId);
    if (matched && selectedColor?.id !== matched.id) {
      setSelectedColor(matched);
    }
  }, [colors, selectedColorId, selectedColor?.id]);

  const displayPrice = useMemo(() => {
    const base = Number(product?.price) || 0;
    const extra = Number(selectedVariant?.additional_price) || 0;
    return base + extra;
  }, [product?.price, selectedVariant]);

  const handleAddToCart = useCallback(() => {
    if (!product?.product_id) return;
    if (!product.in_stock) return;

    // Build variant label e.g. "Black / 256GB"
    const parts = [selectedColor?.name, selectedVariant?.name].filter(Boolean);
    const variantStr = parts.length > 0 ? parts.join(" / ") : undefined;

    // Use the color-specific image if available, otherwise fallback
    const colorImage =
      selectedColor
        ? product.images?.find((img) => img.color === selectedColor.id)?.image
        : null;
    const imageUrl = getCDNImageUrl(colorImage || product?.images?.[0]?.image);

    const cartItem = {
      product_id: product.product_id,
      price: displayPrice,
      image: imageUrl,
      name: product.name,
      quantity,
      variant: variantStr,
    };

    dispatch(addToCart(cartItem));

    if (isLoggedIn) {
      dispatch(sendCartToServer(cartItem));
    } else {
      const localCart = getLocalCart();
      const existingIndex = localCart.findIndex((item) => item.product_id === product.product_id);
      if (existingIndex !== -1) {
        localCart[existingIndex].quantity += quantity;
      } else {
        localCart.push(cartItem);
      }
      setLocalCart(localCart);
    }

    setIsCartOpen(true);
  }, [dispatch, isLoggedIn, product, quantity, selectedColor, selectedVariant, displayPrice]);

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <div className="flex flex-col gap-4 mt-6">

        {/* Price — updates live when variant changes */}
        <div className="space-y-1">
          {product?.old_price ? (
            <div className="text-sm line-through text-muted-foreground">
              Rs {Number(product.old_price).toLocaleString()}
            </div>
          ) : null}
          {product?.before_deal_price ? (
            <div className="text-sm line-through text-muted-foreground">
              Rs {Number(product.before_deal_price).toLocaleString()}
            </div>
          ) : null}
          <div className="text-3xl font-extrabold text-foreground">
            Rs {displayPrice.toLocaleString()}
          </div>
        </div>

        {/* Colour selector */}
        {colors.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Choose Colour</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => {
                const isSelected = selectedColor?.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedColor(c);
                      if (onColorSelect) onColorSelect(c.id);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all focus:outline-none ${
                      isSelected
                        ? "border-red-400 bg-white shadow-sm text-gray-900"
                        : "border-gray-200 bg-white hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    {isSelected && <span className="text-red-500 font-bold text-xs">✓</span>}
                    {c.hex && (
                      <span
                        className="w-4 h-4 rounded-full border border-gray-300 shrink-0"
                        style={{ background: c.hex }}
                      />
                    )}
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Variant / Size selector */}
        {variants.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Choose Size</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                const extra = Number(v.additional_price);
                const priceTag =
                  extra > 0
                    ? `+Rs.${extra.toLocaleString()}`
                    : extra < 0
                    ? `-Rs.${Math.abs(extra).toLocaleString()}`
                    : null;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all focus:outline-none ${
                      isSelected
                        ? "border-red-400 bg-white shadow-sm text-gray-900"
                        : "border-gray-200 bg-white hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    {isSelected && <span className="text-red-500 font-bold text-xs">✓</span>}
                    {v.name}
                    {priceTag && (
                      <span className="text-xs text-gray-400">{priceTag}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity + Add to Cart */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">Quantity</span>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 hover:bg-muted transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-14 text-center border-0 bg-transparent focus:outline-none"
              min={1}
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-2 hover:bg-muted transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className="bg-foreground hover:bg-foreground/90 text-background shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {product.in_stock ? "Add to cart" : "Out of Stock"}
        </Button>
      </div>
    </>
  );
}

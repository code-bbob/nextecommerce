"use client";

import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";

import CartSidebar from "@/components/cartSidebar";
import { Button } from "@/components/ui/button";
import { addToCart, sendCartToServer } from "@/redux/cartSlice";
import { getLocalCart, setLocalCart } from "@/utils/localCart";
import { getCDNImageUrl } from "@/utils/imageUtils";

export default function ProductActions({ product }) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.access.isAuthenticated);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = useCallback(() => {
    if (!product?.product_id) return;

    const cartItem = {
      product_id: product.product_id,
      price: product.price,
      image: getCDNImageUrl(product?.images?.[0]?.image),
      name: product.name,
      quantity,
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
  }, [dispatch, isLoggedIn, product, quantity]);

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <div className="flex flex-col gap-3">
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
          className="bg-foreground hover:bg-foreground/90 text-background shadow-md"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to cart
        </Button>
      </div>
    </>
  );
}

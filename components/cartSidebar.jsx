"use client"

import { useEffect, useRef } from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { updateQuantity, removeFromCart } from '@/redux/cartSlice';
import { updateCartItemOnServer, removeCartItemOnServer } from '@/redux/cartSlice';
import { getLocalCart,setLocalCart } from "@/utils/localCart";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchCartFromServer } from "@/redux/cartSlice";
import { getCDNImageUrl } from "@/utils/imageUtils";

export default function CartSidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const isLoggedIn = useSelector((state) => state.access.isAuthenticated);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const sidebarRef = useRef(null);
  const router = useRouter();


  const handleCheckout=()=>{
    if (isLoggedIn){
      // Redirect to the checkout page
      dispatch(fetchCartFromServer());
      window.open('/checkout','_blank');
    } else {
      //toast you need to be logged in to continue
      toast.error("You need to be logged in to continue");
      // Redirect to the login page
      router.push("/auth/login");
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Update quantity: calculate new quantity and update both locally and on the server.
  const handleUpdateQuantity = (product_id, change) => {
    const item = items.find(i => i.product_id === product_id);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + change);
    dispatch(updateQuantity({ product_id, change }));
    if (isLoggedIn){
    dispatch(updateCartItemOnServer({ product_id, quantity: newQuantity }));
    }
    else {
          // Otherwise, update the local cart in localStorage
          const localCart = getLocalCart()
          const existingIndex = localCart.findIndex(item => item.product_id === product_id)
          if (existingIndex !== -1) {
            // Increase quantity if already exists
            localCart[existingIndex].quantity += change
          } else {
            localCart.push(cartItem)
          }
          setLocalCart(localCart)
        }
  };

  // Remove item: dispatch removal locally and then on the server.
  const handleRemoveItem = (product_id) => {
    dispatch(removeFromCart({ product_id }));
    if (isLoggedIn){
    dispatch(removeCartItemOnServer({ product_id }));
    }
    else {
        const localCart = getLocalCart();
        const index = localCart.findIndex(item => item.product_id === product_id);
        if (index !== -1) {
            localCart.splice(index, 1);
            setLocalCart(localCart);
        }
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false}/>
      {isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={onClose}></div>}

      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 w-80 md:w-96 h-screen bg-card/95 backdrop-blur-md text-foreground shadow-modern border-l border-border transform transition-transform duration-300 z-50 flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">My Cart</h2>
          <button onClick={onClose} aria-label="Close Cart Sidebar" className="hover:text-primary transition-colors duration-200">
            <X className="text-foreground h-5 w-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="p-4 flex flex-col gap-4">
            {items.length === 0 ? (
              <p className="text-muted-foreground">Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <div key={item.product_id} className="flex items-center gap-4 p-3 bg-card/50 rounded-lg border border-border/30 hover:bg-accent/50 transition-colors duration-200">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={getCDNImageUrl(item.image) || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
                    <p className="text-sm text-primary font-medium">RS. {item.price?.toFixed(2)}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.product_id, -1)}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium text-foreground bg-muted px-2 py-1 rounded">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product_id, 1)}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      {/* Delete icon for remove from cart */}
                      <button
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="text-destructive hover:text-destructive/80 transition-colors duration-200"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold text-foreground">RS. {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Taxes</span>
            <span className="text-muted-foreground">Calculated at Checkout</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-muted-foreground">Calculated at Checkout</span>
          </div>
          <Button variant="default" disabled={items.length===0} onClick = {()=>handleCheckout()} className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold btn-futuristic shadow-md hover:shadow-lg transition-all duration-200">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </>
  );
}

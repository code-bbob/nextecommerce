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
      {isOpen && <div className="fixed bg-black/40 backdrop-blur-sm z-40" onClick={onClose}></div>}

      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 w-80 md:w-96 h-screen bg-white dark:bg-slate-950 text-foreground shadow-2xl border-l border-slate-200 dark:border-slate-800 transform transition-transform duration-300 z-50 flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cart</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={onClose} aria-label="Close Cart Sidebar" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors duration-200">
            <X className="text-slate-600 dark:text-slate-400 h-5 w-5" />
          </button>
        </div>

        {/* Items Container */}
        <div className="flex-grow overflow-y-auto">
          <div className="px-4 py-6 flex flex-col gap-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-5xl mb-4">🛒</div>
                <p className="text-slate-500 dark:text-slate-400 text-center">Your cart is empty</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-2">Add items to get started</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product_id} className="group flex gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-all duration-200 border border-slate-100 dark:border-slate-800">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                    <Image
                      src={getCDNImageUrl(item.image) || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      style={{ objectFit: "contain" }}
                      className="object-cover p-1"
                      sizes="80px"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-sm font-bold text-red-600 dark:text-red-500 mt-1">RS. {item.price?.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
                        <button
                          onClick={() => handleUpdateQuantity(item.product_id, -1)}
                          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 p-0.5"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white min-w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product_id, 1)}
                          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 p-0.5"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-500 transition-colors duration-200 p-0.5 ml-auto"
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

        {/* Footer - Summary Section */}
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
          <div className="p-6 space-y-4">
            {/* Summary Details */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 text-sm">Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">RS. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 text-sm">Shipping</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Calculated at checkout</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-slate-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-red-600 dark:text-red-500">RS. {subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button 
              variant="default" 
              disabled={items.length === 0} 
              onClick={() => handleCheckout()} 
              className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              Checkout
            </Button>

            {/* Continue Shopping */}
            <button
              onClick={onClose}
              className="w-full py-2.5 text-center text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

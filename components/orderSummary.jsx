"use client";
import { useState, useEffect, memo } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import customFetch from "@/utils/customFetch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  updatePaymentAmount,
  updateSubtotal,
  updateDiscount,
} from "@/redux/checkoutSlice";
import { getCDNImageUrl } from "@/utils/imageUtils";

const CouponInput = memo(function CouponInput({ subtotal, shippingCost, onApplyCoupon }) {
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  const applyCoupon = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!couponCode.trim()) return;
    try {
      const res = await customFetch(`cart/api/coupon/?code=${couponCode.trim()}`);
      const data = await res.json();
      if (res.ok && data.status === "Success") {
        let discountValue = 0;
        if (data.amount) {
          discountValue = data.amount;
        } else if (data.percentage) {
          discountValue = ((subtotal + shippingCost) * data.percentage) / 100;
        }
        onApplyCoupon(discountValue);
        setCouponMessage("Coupon applied successfully!");
      } else {
        setCouponMessage(data.message || "Coupon is not valid.");
        onApplyCoupon(0);
      }
    } catch (error) {
      setCouponMessage("An error occurred. Please try again.");
      onApplyCoupon(0);
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor="coupon" className="block text-sm font-medium text-gray-200 mb-1">
        Coupon Code
      </label>
      <div className="flex gap-2">
        <Input
          type="text"
          id="coupon"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 px-3 py-2 rounded border border-gray-700 bg-black text-gray-100 focus:outline-none"
        />
        <Button
          onClick={applyCoupon}
          className="px-4 py-2 bg-black border border-white text-white rounded hover:bg-blue-500 transition"
        >
          Apply
        </Button>
      </div>
      {couponMessage && (
        <p className="mt-2 text-sm text-center text-yellow-400">
          {couponMessage}
        </p>
      )}
    </div>
  );
});

export function OrderSummary() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { subtotal: reduxSubtotal, discount: reduxDiscount, shippingCost } = useSelector(
    (state) => state.checkout
  );

  const cartItems = useSelector((state) => state.cart.items);

  // Compute subtotal based on cart items.
  const computedSubtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Compute total amount.
  const total = computedSubtotal + shippingCost - reduxDiscount;

  // Update Redux subtotal and payment amount when cart items change.
  useEffect(() => {
    dispatch(updateSubtotal(computedSubtotal));
    dispatch(updatePaymentAmount(total));
  }, [computedSubtotal, total, dispatch]);


  const [isExpanded, setIsExpanded] = useState(false);

  const MobileSummaryHeader = () => (
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className="w-full flex items-center justify-between p-4 bg-black text-white border-b border-gray-800"
    >
      <div className="flex items-center gap-2">
        <span className="text-blue-500">Order summary</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </div>
      <span className="font-semibold">RS. {total.toFixed(2)}</span>
    </button>
  );

  const SummaryContent = () => (
    <>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          <h2 className="text-lg text-center font-semibold lg:mb-6">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.product_id} className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded">
                <div className="absolute -right-2 -top-2 w-5 h-5 z-50 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                  {item.quantity}
                </div>
                <Image
                  src={getCDNImageUrl(item.image) || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover rounded"zzzCu
                  sizes="64px"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium line-clamp-2">{item.name}</p>
                <p className="text-sm text-gray-400">{item.variant}</p>
              </div>
              <p className="font-medium">RS. {(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-800 p-6 bg-black">
      <CouponInput
            subtotal={reduxSubtotal}
            shippingCost={shippingCost}
            onApplyCoupon={(discountValue) => dispatch(updateDiscount(discountValue))}
          />
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Subtotal</span>
            <span>RS. {computedSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Shipping</span>
            <span>RS. {shippingCost.toFixed(2)}</span>
          </div>
          {reduxDiscount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400">Discount</span>
              <span className="text-green-400">- RS. {reduxDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">RS.</span>
              <span>{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden bg-black text-white">
        <MobileSummaryHeader />
        <div
          className={`${
            isExpanded ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          } transition-all duration-300 ease-in-out overflow-hidden`}
        >
          <SummaryContent />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block lg:w-[380px]">
        <div className="fixed w-[380px] h-screen right-0 top-0 border-l border-gray-800 bg-black">
          <div className="flex flex-col h-full">
            <SummaryContent />
          </div>
        </div>
      </div>
    </>
  );
}

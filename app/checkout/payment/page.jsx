"use client";
import { OrderSummary } from "@/components/orderSummary";
import { ChevronLeft, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import customFetch from "@/utils/customFetch";
import { fetchCartFromServer, clearCart } from "@/redux/cartSlice";
import { resetCheckout } from "@/redux/checkoutSlice";
import BlackNavBar from "@/components/blackNavbar";
import toast from "react-hot-toast";
import { clearLocalCart } from "@/utils/localCart";

// Validation schema for required fields
const validateCheckoutData = (data) => {
  const errors = [];

  if (!data.email || !data.email.trim()) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Please enter a valid email");
  }

  if (!data.phone || !data.phone.trim()) {
    errors.push("Phone number is required");
  }

  if (!data.shippingAddress.firstName || !data.shippingAddress.firstName.trim()) {
    errors.push("First name is required");
  }

  if (!data.shippingAddress.lastName || !data.shippingAddress.lastName.trim()) {
    errors.push("Last name is required");
  }

  if (!data.shippingAddress.address || !data.shippingAddress.address.trim()) {
    errors.push("Shipping address is required");
  }

  if (!data.shippingAddress.city || !data.shippingAddress.city.trim()) {
    errors.push("City is required");
  }

  if (!data.shippingAddress.municipality || !data.shippingAddress.municipality.trim()) {
    errors.push("Municipality is required");
  }

  if (!data.shippingMethod || !data.shippingMethod.trim()) {
    errors.push("Shipping method is required");
  }

  if (!data.cartItems || data.cartItems.length === 0) {
    errors.push("Cart is empty");
  }

  return errors;
};

export default function PaymentPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const checkout = useSelector((state) => state.checkout);
  const cartItems = useSelector((state) => state.cart.items);
  const isLoggedIn = useSelector((state) => state.access?.isAuthenticated);

  const { subtotal, shippingCost, discount, email, shippingAddress, shippingMethod, phone, couponCode } = checkout;
  const total = subtotal + shippingCost - discount;
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!email || !shippingAddress.address) {
      router.replace("/checkout");
    }
  }, [email, shippingAddress.address, router]);

  // Validate form data on component load and when checkout data changes
  useEffect(() => {
    const errors = validateCheckoutData({
      email,
      phone,
      shippingAddress,
      shippingMethod,
      cartItems,
    });
    setValidationErrors(errors);
  }, [email, phone, shippingAddress, shippingMethod, cartItems]);

  const handleCODPayment = async () => {
    try {
      setLoading(true);
      
      // Prepare items data from cart items
      const items = cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      // Prepare checkout payload with order and delivery info
      const checkoutPayload = {
        items,
        phone_number: phone,
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        email: email,
        shipping_address: shippingAddress.address,
        city: shippingAddress.city,
        municipality: shippingAddress.municipality,
        shipping_method: shippingMethod,
        payment_method: "COD",
        subtotal: subtotal,
        shipping_cost: shippingCost,
        discount: discount,
        coupon_code: couponCode,
        payment_amount: total,
      };

      // Single API call to create order and delivery in one request
      const res = await customFetch(`cart/api/checkout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const couponError = errorData?.coupon_error;
        if (couponError) {
          throw new Error(`Coupon Error: ${couponError}. Please reload and try again.`);
        }
        throw new Error(errorData?.detail || errorData?.message || "Failed to place order");
      }

      // Clear cart for both logged-in and guest users
      if (isLoggedIn) {
        await dispatch(fetchCartFromServer());
      } else {
        dispatch(clearCart());
        clearLocalCart();
      }

      // Reset checkout form
      await dispatch(resetCheckout());
      toast.success("Order placed successfully!");
      
      // Small delay to ensure state updates before navigation
      setTimeout(() => {
        router.push(`/`);
      }, 500);
    } catch (err) {
      console.error("Order creation failed:", err);
      toast.error(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen">
        <BlackNavBar />
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-400">Processing your order...</p>
            <p className="text-xs text-gray-500">Please do not close or refresh this page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="order-first lg:order-last">
            <OrderSummary />
          </div>
          <div className="flex-1 space-y-8">
            <nav className="text-sm mb-8">
              <ol className="flex items-center space-x-2">
                <div className="w-16 mr-4 ">
                  <Image src="/images/digi.png" alt="logo" width={50} height={30} />
                </div>
                <li>
                  <Link href="/checkout" className="text-blue-500 hover:text-blue-400">
                    Information
                  </Link>
                </li>
                <li>›</li>
                <li>
                  <Link href="/checkout/shipping" className="text-blue-500 hover:text-blue-400">
                    Shipping
                  </Link>
                </li>
                <li>›</li>
                <li className="text-white">Payment</li>
              </ol>
            </nav>

            {/* Display Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-red-400">Please fix the following errors:</h3>
                    <ul className="text-sm text-red-300 space-y-1 list-disc list-inside">
                      {validationErrors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-red-400 mt-2">
                      Click "Change" above to update your information
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="border border-gray-800 rounded-lg">
              <div className="p-4 flex justify-between items-center border-b border-gray-800">
                <div>
                  <span className="text-gray-400">Contact</span>
                  <p className="text-sm mt-1">{email || "example@email.com"}</p>
                </div>
                <Link href="/checkout" className="text-blue-500 text-sm hover:text-blue-400">
                  Change
                </Link>
              </div>
              <div className="p-4 flex justify-between items-center border-b border-gray-800">
                <div>
                  <span className="text-gray-400">Ship to</span>
                  <p className="text-sm mt-1 capitalize">
                    {shippingAddress.address || "123 Street Name, City, State ZIP"}
                  </p>
                </div>
                <Link href="/checkout" className="text-blue-500 text-sm hover:text-blue-400">
                  Change
                </Link>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <span className="text-gray-400">Shipping method</span>
                  <p className="text-sm mt-1">
                    {shippingMethod === "Urgent"
                      ? "Urgent · RS. 8.90"
                      : "Standard · Rs. 100"}
                  </p>
                </div>
                <Link href="/checkout/shipping" className="text-blue-500 text-sm hover:text-blue-400">
                  Change
                </Link>
              </div>
            </div>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Payment</h2>
              <p className="text-sm text-gray-400">All transactions are secure.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Payment Method Selector */}
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-800 rounded-lg cursor-pointer hover:bg-gray-900 transition" onClick={() => setPaymentMethod("cod")}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                      disabled={loading}
                    />
                    <div className="flex items-center flex-1">
                      <CreditCard className="h-5 w-5 mr-3 text-green-500" />
                      <div>
                        <p className="font-medium">Cash on Delivery (COD)</p>
                        <p className="text-xs text-gray-400">Pay when you receive your order</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* COD Payment Section */}
                {paymentMethod === "cod" && (
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Order Summary</h3>
                      <div className="flex justify-between text-sm py-2">
                        <span className="text-gray-400">Subtotal:</span>
                        <span>Rs. {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm py-2">
                        <span className="text-gray-400">Shipping:</span>
                        <span>Rs. {shippingCost.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm py-2 text-green-500">
                          <span>Discount:</span>
                          <span>Rs. -{discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-700 my-2"></div>
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>Rs. {total.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || validationErrors.length > 0}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Processing..." : "Place Order (COD)"}
                    </button>
                    {validationErrors.length > 0 && (
                      <p className="text-xs text-red-400 text-center">
                        Fix the errors above to proceed
                      </p>
                    )}
                  </div>
                )}
              </form>
            </section>

            <div className="flex justify-between items-center">
              <Link 
                href="/checkout/shipping" 
                className={`text-blue-500 hover:text-blue-400 flex items-center ${loading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Return to shipping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-md w-full space-y-4">
            <div className="bg-gray-800/50 p-6 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <h2 className="text-xl font-semibold">Confirm Your Order</h2>
              </div>
              <p className="text-sm text-gray-400">Please review your order details before placing it.</p>
            </div>

            <div className="px-6 space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Subtotal:</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Shipping:</span>
                  <span>Rs. {shippingCost.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between border-b border-gray-700 pb-2 text-green-500">
                    <span>Discount:</span>
                    <span>Rs. -{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-2">
                  <span>Total to Pay:</span>
                  <span className="text-green-500">Rs. {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gray-800/50 p-3 rounded space-y-1 text-sm">
                <p className="text-gray-400">
                  <span className="font-medium">Delivery To:</span> {shippingAddress.address}
                </p>
                <p className="text-gray-400">
                  <span className="font-medium">Method:</span> {shippingMethod}
                </p>
                <p className="text-gray-400">
                  <span className="font-medium">Contact:</span> {email}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-3">
              <button
                type="button"
                onClick={async () => {
                  setShowConfirmation(false);
                  await handleCODPayment();
                }}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Confirm & Place Order"}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

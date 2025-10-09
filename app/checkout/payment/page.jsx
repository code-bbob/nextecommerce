"use client";
import { OrderSummary } from "@/components/orderSummary";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import customFetch from "@/utils/customFetch";
import { fetchCartFromServer } from "@/redux/cartSlice";
import NavBar from "@/components/navbar";
import { resetCheckout } from "@/redux/checkoutSlice";
import BlackNavBar from "@/components/blackNavbar";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const checkout = useSelector((state) => state.checkout);
  const cartItems = useSelector((state) => state.cart.items);

  const { subtotal, shippingCost, discount, email, shippingAddress, shippingMethod, phone } = checkout;
  const total = subtotal + shippingCost - discount;

  useEffect(() => {
    if (!email || !shippingAddress.address) {
      router.replace("/checkout");
    }
  }, [email, shippingAddress.address, router]);

  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    try {
      const carts = cartItems.map((item) => item.id);
      const orderRes = await customFetch(`cart/api/order/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carts }),
      });
      const orderResponse = await orderRes.json();
      const order_id = orderResponse.id;

      const deliveryPayload = {
        order: order_id,
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
        payment_amount: total,
      };

      const res = await customFetch(`cart/api/delivery/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deliveryPayload),
      });

      await dispatch(fetchCartFromServer());
      await dispatch(resetCheckout());
      if (res.status == 200) {
        toast.success("Order placed successfully!");
      }
      router.push(`/`);
    } catch (err) {
      console.error(err);
      // Handle the error (e.g., show an error message to the user)
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of your component)


  if (loading) {
    return (
      <div className=" h-screen">
        <BlackNavBar />
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
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
                <Image src="/images/digi.png" alt="logo" width={50} height={30} />
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
                  <p className="text-sm mt-1">
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
                      : "Standard · Free"}
                  </p>
                </div>
                <Link href="/checkout/shipping" className="text-blue-500 text-sm hover:text-blue-400">
                  Change
                </Link>
              </div>
            </div>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Payment</h2>
              <p className="text-sm text-gray-400">All transactions are secure and encrypted.</p>
              <div className="bg-gray-900 rounded-lg p-8 text-center space-y-4">
                <CreditCard className="mx-auto h-12 w-12 text-gray-500" />
                <p>This store only accepts cash on delivery right now.</p>
              </div>
            </section>
            <div className="flex justify-between items-center">
              <Link href="/checkout/shipping" className="text-blue-500 hover:text-blue-400 flex items-center">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Return to shipping
              </Link>
              <Button disabled={loading} onClick={handleNext} className="bg-gray-700">
                Proceed
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// pages/checkout/payment.tsx
"use client";
import { OrderSummary } from "@/components/orderSummary";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const checkout = useSelector((state) => state.checkout);
  const router = useRouter();
  useEffect(() => {
    if (!checkout.email || !checkout.shippingAddress.address) {
      router.push("/checkout");
    }
  }, [checkout.email, checkout.shippingAddress.address]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        onClick={() => router.push("/")}
        className="hidden lg:block absolute mt-8 text-white pl-3"
      >
        <Image src="/images/digi.png" alt="logo" width={50} height={30} />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="order-first lg:order-last">
            <OrderSummary />
          </div>

          {/* Left Column - Payment */}
          <div className="flex-1 space-y-8">
            <nav className="text-sm mb-8">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link
                    href="/checkout"
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Information
                  </Link>
                </li>
                <li>›</li>
                <li>
                  <Link
                    href="/checkout/shipping"
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Shipping
                  </Link>
                </li>
                <li>›</li>
                <li className="text-white">Payment</li>
              </ol>
            </nav>

            {/* Summary Sections */}
            <div className="border border-gray-800 rounded-lg">
              <div className="p-4 flex justify-between items-center border-b border-gray-800">
                <div>
                  <span className="text-gray-400">Contact</span>
                  <p className="text-sm mt-1">
                    {checkout.email || "example@email.com"}
                  </p>
                </div>
                <Link
                  href="/checkout"
                  className="text-blue-500 text-sm hover:text-blue-400"
                >
                  Change
                </Link>
              </div>
              <div className="p-4 flex justify-between items-center border-b border-gray-800">
                <div>
                  <span className="text-gray-400">Ship to</span>
                  <p className="text-sm mt-1">
                    {checkout.shippingAddress.address ||
                      "123 Street Name, City, State ZIP"}
                  </p>
                </div>
                <Link
                  href="/checkout"
                  className="text-blue-500 text-sm hover:text-blue-400"
                >
                  Change
                </Link>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <span className="text-gray-400">Shipping method</span>
                  <p className="text-sm mt-1">
                    {checkout.shippingMethod === "economy"
                      ? "Economy · $4.90"
                      : "Standard · $6.90"}
                  </p>
                </div>
                <Link
                  href="/checkout/shipping"
                  className="text-blue-500 text-sm hover:text-blue-400"
                >
                  Change
                </Link>
              </div>
            </div>

            {/* Payment Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Payment</h2>
              <p className="text-sm text-gray-400">
                All transactions are secure and encrypted.
              </p>
              <div className="bg-gray-900 rounded-lg p-8 text-center space-y-4">
                <CreditCard className="mx-auto h-12 w-12 text-gray-500" />
                <p>This store can&apos;t accept payments right now.</p>
              </div>
            </section>

            <div className="flex justify-between items-center">
              <Link
                href="/checkout/shipping"
                className="text-blue-500 hover:text-blue-400 flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Return to shipping
              </Link>
              <Button disabled className="bg-gray-700 cursor-not-allowed">
                Pay now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

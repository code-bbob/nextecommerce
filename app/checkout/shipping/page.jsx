// pages/checkout/shipping.tsx
"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateShippingMethod,
  updateShippingCost,
} from "@/redux/checkoutSlice";
import { OrderSummary } from "@/components/orderSummary";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const shippingMethods = [
  { id: "Urgent", name: "Urgent", price: 8.9, duration: "Same day" },
  {
    id: "standard",
    name: "Standard",
    price: 6.9,
    duration: "3 to 4 business days",
  },
];

export default function ShippingPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const checkout = useSelector((state) => state.checkout);
  // find if the page was refreshed and go back to the previous page if it was
  useEffect(() => {
    if (!checkout.email || !checkout.shippingAddress.address) {
      router.push("/checkout");
    }
  }, [checkout.email, checkout.shippingAddress.address]);
  const [selectedMethod, setSelectedMethod] = useState(checkout.shippingMethod);
  const [selectedCost, setSelectedCost] = useState(checkout.shippingCost);

  useEffect(() => {
    dispatch(updateShippingMethod(selectedMethod));
    dispatch(updateShippingCost(selectedCost));
  }, [selectedMethod, selectedCost, dispatch]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        onClick={() => router.push("/")}
        className="hidden lg:block text-white absolute mt-8 pl-3"
      >
        <Image src="/images/digi.png" alt="logo" width={50} height={30} />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="order-first lg:order-last">
            <OrderSummary />
          </div>

          {/* Left Column - Shipping Method */}
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
                <li className="text-white">Shipping</li>
                <li>›</li>
                <li className="text-gray-500">Payment</li>
              </ol>
            </nav>

            {/* Contact and Shipping Summary */}
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
            </div>

            {/* Shipping Method Selection */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Shipping method</h2>
              <RadioGroup
                value={selectedMethod}
                onValueChange={(value) => {
                  setSelectedMethod(value);
                  const method = shippingMethods.find((m) => m.id === value);
                  if (method) {
                    setSelectedCost(method.price);
                  }
                }}
                className="space-y-2"
              >
                {shippingMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between border border-gray-800 rounded-lg p-4 cursor-pointer hover:border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem className="text-white border-white" value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="cursor-pointer">
                        <div>
                          <p>{method.name}</p>
                          <p className="text-sm text-gray-400">
                            {method.duration}
                          </p>
                        </div>
                      </Label>
                    </div>
                    <span>${method.price.toFixed(2)}</span>
                  </div>
                ))}
              </RadioGroup>
            </section>

            <div className="flex justify-between items-center">
              <Link
                href="/checkout"
                className="text-blue-500 hover:text-blue-400 flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Return to information
              </Link>
              <Link href="/checkout/payment">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Continue to payment
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          {/* <OrderSummary /> */}
        </div>
      </div>
    </div>
  );
}

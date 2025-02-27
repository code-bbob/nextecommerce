"use client";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  updateEmail,
  updatePhone,
  updateNewsOptIn,
  updateShippingAddress,
} from "@/redux/checkoutSlice";
import { OrderSummary } from "@/components/orderSummary";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const checkout = useSelector((state) => state.checkout);
  const router = useRouter();

  // Initialize react-hook-form with default values from Redux state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: checkout.email,
      phone: checkout.phone, // You can also set a default phone if available
      newsOptIn: checkout.newsOptIn,
      shippingAddress: {
        firstName: checkout.shippingAddress.firstName,
        lastName: checkout.shippingAddress.lastName,
        address: checkout.shippingAddress.address,
        apartment: checkout.shippingAddress.apartment,
        municipality: checkout.shippingAddress.municipality || "",
        city: checkout.shippingAddress.city,
        state: checkout.shippingAddress.state,
        country: checkout.shippingAddress.country,
      },
    },
  });

  const onSubmit = (data) => {
    dispatch(updateEmail(data.email));
    dispatch(updatePhone(data.phone));
    dispatch(updateNewsOptIn(data.newsOptIn));
    dispatch(updateShippingAddress(data.shippingAddress));
    // Optionally, dispatch phone if you want to store it in Redux as well.
    // Navigate to the next page, for example:
    router.push("/checkout/shipping");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Wrap the whole page in a form */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col lg:flex-row gap-8"
        >
          <div className="order-first lg:order-last">
            <OrderSummary />
          </div>

          {/* Left Column - Forms */}
          <div className="flex-1 space-y-8">
            <nav className="text-sm mb-8">
              <ol className="flex items-center space-x-2">
              <Image src="/images/digi.png" alt="logo" width={50} height={30} />
                <li className="text-white">Information</li>
                <li>›</li>
                <li className="text-gray-500">Shipping</li>
                <li>›</li>
                <li className="text-gray-500">Payment</li>
              </ol>
            </nav>

            {/* Contact Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Contact</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", { required: "Email is required" })}
                      className={`mt-1 bg-transparent border-gray-700 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone No.</Label>
                    <Input
                      id="phone"
                      type="text"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^9\d{9}$/,
                          message: "Enter a valid phone number",
                        },
                      })}
                      className={`mt-1 bg-transparent border-gray-700 ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    {...register("newsOptIn")}
                    className="border-white"
                  />
                  <Label htmlFor="newsletter">
                    Email me with news and offers
                  </Label>
                </div>
              </div>
            </section>

            {/* Shipping Address Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Shipping address</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="country">Country/Region</Label>
                  <Select defaultValue={checkout.shippingAddress.country}>
                    <SelectTrigger className="w-full mt-1 bg-transparent border-gray-700">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Update the options as needed */}
                      <SelectItem value="US">Nepal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name (optional)</Label>
                    <Input
                      id="firstName"
                      type="text"
                      {...register("shippingAddress.firstName")}
                      className="mt-1 bg-transparent border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      {...register("shippingAddress.lastName", {
                        required: "Last name is required",
                      })}
                      className={`mt-1 bg-transparent border-gray-700 ${
                        errors.shippingAddress?.lastName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.shippingAddress?.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.shippingAddress.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Shipping Address</Label>
                  <Input
                    id="address"
                    type="text"
                    {...register("shippingAddress.address", {
                      required: "Address is required",
                    })}
                    className={`mt-1 bg-transparent border-gray-700 ${
                      errors.shippingAddress?.address ? "border-red-500" : ""
                    }`}
                  />
                  {errors.shippingAddress?.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.shippingAddress.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="apartment">
                    Tol/Area/Apartment (optional)
                  </Label>
                  <Input
                    id="apartment"
                    type="text"
                    {...register("shippingAddress.apartment")}
                    className="mt-1 bg-transparent border-gray-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="municipality">Municipality</Label>
                    <Input
                      id="municipality"
                      type="text"
                      {...register("shippingAddress.municipality")}
                      className="mt-1 bg-transparent border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      {...register("shippingAddress.city", {
                        required: "City is required",
                      })}
                      className={`mt-1 bg-transparent border-gray-700 ${
                        errors.shippingAddress?.city ? "border-red-500" : ""
                      }`}
                    />
                    {errors.shippingAddress?.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.shippingAddress.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      type="text"
                      {...register("shippingAddress.state", {
                        required: "State is required",
                      })}
                      className={`mt-1 bg-transparent border-gray-700 ${
                        errors.shippingAddress?.state ? "border-red-500" : ""
                      }`}
                    />
                    {errors.shippingAddress?.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.shippingAddress.state.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-white text-black hover:bg-gray-200"
              >
                Continue to shipping
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

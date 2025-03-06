"use client"
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/navbar";

export default function TrackingPage() {
    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;
        setLoading(true);
        router.push(`/tracking/${orderId.trim()}`);
    };

    return (
        <div className="min-h-screen  bg-gradient-to-br from-black via-gray-600 to-black">
            <NavBar />
            <div className="flex items-center justify-center pt-5 md:pt-12">
            <div className="max-w-md w-full bg-gradient-to-br from-black via-gray-600 to-black p-6 rounded-lg shadow-md">
                <h1 className="text-2xl text-white font-bold mb-4 text-center">Track Your Order</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="orderId" className="block text-white mb-2">
                        Order ID
                    </label>
                    <input
                        id="orderId"
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:border-blue-500"
                        placeholder="Enter your Order ID"
                    />
                    <Suspense fallback={<div className="text-center">Searching...</div>}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white bg-black py-2 rounded hover:bg-gray-900 transition-colors"
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </Suspense>
                </form>
            </div>
            </div>
            <div className=" text-white justify-center text-center mt-8">
            <p className="font-extrabold text-xl">Brief on how the delivery process goes:</p>
            <ol className="list-decimal list-inside">
                <li>Order placed</li>
                <li>Order confirmed</li>
                <li>Call for Verification</li>
                <li>Order dispatched</li>
                <li>Out for delivery</li>
                <li>Order delivered</li>
            </ol>
            </div>
        </div>
    );
}
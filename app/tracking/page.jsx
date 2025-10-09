"use client";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import BlackNavBar from "@/components/blackNavbar";

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
            <BlackNavBar />
            <div className="flex items-center justify-center pt-6 md:pt-16 px-4">
                <div className="w-full max-w-xl bg-black/60 border border-white/10 p-6 rounded-xl shadow-xl">
                    <h1 className="text-2xl text-white font-bold mb-2 text-center">Track your order</h1>
                    <p className="text-white/70 text-center mb-6 text-sm">Enter your Order ID to view live status and timeline.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label htmlFor="orderId" className="block text-white text-sm">
                            Order ID
                        </label>
                        <div className="flex gap-2">
                            <Input
                                id="orderId"
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="e.g. ORD-12345"
                                required
                            />
                            <Suspense fallback={<div className="text-center">...</div>}>
                                <Button type="submit" disabled={loading} className="bg-gray-800 min-w-28">
                                    <Search className="w-4 h-4" />
                                    {loading ? "Searching" : "Search"}
                                </Button>
                            </Suspense>
                        </div>
                    </form>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-white/70">
                        <Badge className="bg-white/10 border-white/20">Order placed</Badge>
                        <Badge className="bg-white/10 border-white/20">Confirmed</Badge>
                        <Badge className="bg-white/10 border-white/20">Verification</Badge>
                        <Badge className="bg-white/10 border-white/20">Dispatched</Badge>
                        <Badge className="bg-white/10 border-white/20">Out for delivery</Badge>
                        <Badge className="bg-white/10 border-white/20">Delivered</Badge>
                    </div>
                </div>
            </div>
            <div className="text-white text-center mt-10 px-4">
                <p className="font-semibold text-lg mb-2">How delivery works</p>
                <ol className="list-decimal list-inside text-white/80 max-w-xl mx-auto text-sm space-y-1">
                    <li>Order placed</li>
                    <li>Order confirmed</li>
                    <li>Call for verification</li>
                    <li>Order dispatched</li>
                    <li>Out for delivery</li>
                    <li>Order delivered</li>
                </ol>
            </div>
        </div>
    );
}
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrackingTimeline, buildSteps } from "@/components/TrackingTimeline";
import { STATUS_ORDER, fetchTracking } from "@/utils/trackingApi";
import { Loader2 } from "lucide-react";
import NavBar from "@/components/navbar";

export default function TrackingPage() {
    const router = useRouter();
    const { orderId: urlOrderId } = useParams();
    const [searchOrderId, setSearchOrderId] = useState(urlOrderId || "");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const runFetch = async (id) => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetchTracking(String(id));
            setData(res);
        } catch (e) {
            setError(e?.message || "Failed to load tracking");
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        runFetch(urlOrderId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlOrderId]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchOrderId.trim()) {
            router.push(`/tracking/${searchOrderId.trim()}`);
        }
    };

    const steps = useMemo(() => {
        if (!data) return [];
        return buildSteps({ updates: data.updates || [], currentStatus: data.currentStatus, STATUS_ORDER });
    }, [data]);

    return (
        <div className="min-h-screen bg-black text-white">
            <NavBar />
            <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
                <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                    <Input
                        value={searchOrderId}
                        onChange={(e) => setSearchOrderId(e.target.value)}
                        placeholder="Search another Order ID"
                    />
                    <Button type="submit" className="bg-gray-800">Search</Button>
                </form>

                {loading && (
                    <div className="flex items-center gap-2 text-white/80">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading tracking...
                    </div>
                )}
                {error && (
                    <div className="border border-red-500/30 bg-red-500/10 text-red-200 p-4 rounded-md">
                        {error}
                    </div>
                )}
                {!loading && !error && data && (
                    <div className="bg-black/60 border border-white/10 rounded-xl p-6 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h1 className="text-xl font-semibold">Order ID: {data.orderId || urlOrderId}</h1>
                            {data.currentStatus && (
                                <Badge className="bg-white/10 border-white/20">{data.currentStatus.replaceAll("_", " ")}</Badge>
                            )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-3 text-sm text-white/80">
                            {data.customerName && <div>Customer: <span className="text-white">{data.customerName}</span></div>}
                            {data.phone && <div>Phone: <span className="text-white">{data.phone}</span></div>}
                            {data.email && <div>Email: <span className="text-white">{data.email}</span></div>}
                            {data.shippingAddress && <div className="md:col-span-2">Address: <span className="text-white">{data.shippingAddress}</span></div>}
                        </div>

                        <TrackingTimeline steps={steps} currentStatus={data.currentStatus} />
                    </div>
                )}
            </div>
        </div>
    );
}

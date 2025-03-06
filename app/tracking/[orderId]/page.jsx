"use client"

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation'

function TrackingPage() {
    const router = useRouter()
const { orderId: urlOrderId } = useParams()
const [searchOrderId, setSearchOrderId] = useState('')

const handleSearch = (e) => {
    e.preventDefault()
    if (searchOrderId.trim()) {
        router.push(`/tracking/${searchOrderId.trim()}`)
    }
}

    const [trackingData] = useState({
        orderId: "123456789",
        customer: "John Doe",
        currentStatus: "In Transit",
        updates: [
            { timestamp: "2023-10-01T09:00:00Z", status: "Order Placed", location: "Online Store" },
            { timestamp: "2023-10-01T12:00:00Z", status: "Order Confirmed", location: "Warehouse A" },
            { timestamp: "2023-10-02T08:00:00Z", status: "Dispatched", location: "Warehouse A" },
            { timestamp: "2023-10-02T14:00:00Z", status: "In Transit", location: "City Hub" },
            { timestamp: "2023-10-03T09:00:00Z", status: "Delivered", location: "Customer's Address" }
        ]
    });

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h1>Delivery Tracking</h1>
            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px', background: '#f9f9f9' }}>
                <h2>Order ID: {trackingData.orderId}</h2>
                <p>Customer: {trackingData.customer}</p>
                <p>
                    Current Status: <strong>{trackingData.currentStatus}</strong>
                </p>
                <hr />
                <h3>Tracking History</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {trackingData.updates.map((update, index) => (
                        <li key={index} style={{ marginBottom: '20px' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                                {new Date(update.timestamp).toLocaleString()}
                            </p>
                            <p style={{ margin: '5px 0 0 0' }}>
                                <strong>{update.status}</strong> – {update.location}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TrackingPage;
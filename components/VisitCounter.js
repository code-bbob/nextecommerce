'use client';

import { useState, useEffect } from 'react';

const VisitCounter = () => {
    const [visits, setVisits] = useState(null);

    useEffect(() => {
        const incrementVisits = async () => {
            try {
                // Call POST to increment and get updated count
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/shop/api/visits/`, {
                    method: 'POST',
                });
                if (res.ok) {
                    const data = await res.json();
                    setVisits(data.visits);
                }
            } catch (error) {
                console.error("Failed to update visit count", error);
            }
        };

        incrementVisits();
    }, []);

    if (visits === null) return null;

    
};

export default VisitCounter;

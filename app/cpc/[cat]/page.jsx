"use client"
import { Suspense, useState, useEffect } from 'react';
import NavBar from "@/components/navbar";
import ProductGrid from "@/components/productGrid";
import FilterSidebar from "@/components/filterSidebar";
import customFetch from "@/utils/customFetch";
import Footer from '@/components/footer';
import { useParams } from 'next/navigation';

export default function CatPage() {
    const params = useParams();
    const category = params.cat;
    const [products, setProducts] = useState([]);
    const [ordering, setOrdering] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let apiUrl = `shop/api/catsearch/${category}`;
                if (ordering) {
                    apiUrl += `?ordering=${ordering}`;
                }
                const res = await customFetch(apiUrl);
                const newProducts = await res.json();
                setProducts(newProducts);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProducts();
    }, [category, ordering]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-600 to-black font-sans">
            <NavBar />
            <div className="flex">
                <aside className="w-full md:w-64 shadow-2xl border-black backdrop-blur-md md:min-h-screen">
                    <Suspense fallback={<div className="text-white">Loading filters...</div>}>
                        <FilterSidebar category={category} setOrdering={setOrdering} />
                    </Suspense>
                </aside>
                <main className="flex-1 p-4 md:p-8">
                    <h1 className="text-3xl md:text-4xl text-center font-extrabold text-white mb-6 capitalize">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                            {category} Products
                        </span>
                    </h1>
                    <Suspense fallback={<div className="text-white">Loading products...</div>}>
                        <ProductGrid products={products} />
                    </Suspense>
                </main>
            </div>
            <Footer />
        </div>
    );
}
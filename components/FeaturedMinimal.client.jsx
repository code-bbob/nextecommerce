"use client";
import Image from "next/image";
import Link from "next/link";

const items = [
  { id: 1, name: "AirPods Max", price: "Rs. 89,900", image: "/images/airpodmax.png", href: "/search?q=airpods" },
  { id: 2, name: "iPhone 15 Pro", price: "Rs. 179,900", image: "/images/iphone.png", href: "/search?q=iphone" },
  { id: 3, name: "Gaming GPU", price: "Rs. 120,000", image: "/images/gpu.png", href: "/search?q=gpu" },
  { id: 4, name: "SSD NVMe", price: "Rs. 8,500", image: "/images/ssd.jpg", href: "/search?q=ssd" },
  { id: 5, name: "Smartwatch", price: "Rs. 24,900", image: "/images/pic2.jpg", href: "/search?q=watch" },
  { id: 6, name: "Laptop", price: "Rs. 109,900", image: "/images/newhp.png", href: "/search?q=laptop" }
];

export default function FeaturedMinimal() {
  return (
    <section className="py-8 md:py-12" id="featured">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Featured</h2>
        <Link href="/store" className="text-sm text-blue-600 hover:underline">Browse all</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {items.map((it) => (
          <Link key={it.id} href={it.href} className="group rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition overflow-hidden">
            <div className="relative aspect-square">
              <Image src={it.image} alt={it.name} fill className="object-contain p-4" />
            </div>
            <div className="px-3 pb-3">
              <div className="text-sm font-medium truncate">{it.name}</div>
              <div className="text-sm text-muted-foreground">{it.price}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

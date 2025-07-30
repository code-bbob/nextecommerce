"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { getCDNImageUrl } from "@/utils/imageUtils";

export default function BlogSlider() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}blog/api/`);
        if (!res.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await res.json();
        setBlogs(data || []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBlogs();
  }, []);

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Latest Blogs</h2>

      {/* Main grid container */}
      <div className="md:grid md:grid-cols-7 md:grid-rows-2 gap-4 px-4 max-w-7xl ">
        {blogs.slice(0, 5).map((item, index) => {
          let layoutClasses = "";
          if (index === 0) {
            layoutClasses = "col-span-2 row-span-2";
          } else if (index === 1) {
            layoutClasses = "col-span-2 row-span-1 col-start-3";
          } else if (index === 2) {
            layoutClasses = "col-span-2 row-span-1 col-start-3 row-start-2";
          } else if (index === 3) {
            layoutClasses = "col-span-3 row-span-1";
          } else if (index === 4) {
            layoutClasses = "col-span-3 row-span-1";
          }

          return (
            <div
              key={item.id}
              className={`bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-modern transition-transform hover:scale-105 duration-300 cursor-pointer ${layoutClasses}`}
              style={{ maxWidth: '100%' }}
              onClick={() =>{router.push(`/blog/${item.id}`)}}
            >
              <h1 className="font-bold text-xl mb-4 line-clamp-2 text-foreground">
                {item.title}
              </h1>

              {item.image && (
                <div className="relative w-full h-40 md:h-48 lg:h-56 rounded-md overflow-hidden">
                  <Image
                    src={getCDNImageUrl(item.image)}
                    alt={item.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              {index === 0 && (
                <div className="text-muted-foreground">
                  <div style={{ maxHeight: '300px', overflowY: 'hidden' }}>
                    <p dangerouslySetInnerHTML={{ __html: item.content }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center mt-6">
        <Link href="/store">
          <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold transition-colors duration-200">
            See More
          </button>
        </Link>
      </div>
    </section>
  );
}
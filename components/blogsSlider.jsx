"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function BlogSlider() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("http://127.0.0.1:8000/blog/api/");
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
    <section className="text-white py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Latest Blogs</h2>

      {/* Main grid container */}
      <div className="grid grid-cols-7 grid-rows-2 gap-4 px-4">
        {blogs.slice(0, 5).map((item, index) => {
          // Define custom grid spans for each index
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
              className={`bg-gradient-to-b from-black via-gray-700 to-gray-900  rounded-lg p-4 shadow-lg transition-transform duration-300 ${layoutClasses}`}
            >
              <h1 className="font-bold text-xl mb-4 line-clamp-2">
                {item.title}
              </h1>

              {/* Image container */}
              {item.image && (
                <div className="relative w-full h-40 md:h-48 lg:h-56 rounded-md overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              )}
              {index === 0 &&(<div className="text-white">
                 <p dangerouslySetInnerHTML={{ __html: item.content }}/>
                  
                </div>
            )}
            </div>
          );
        })}
      </div>

      {/* "See More" button */}
      <div className="flex items-center justify-center mt-6">
        <Link href="/store">
          <button className="px-6 py-3 bg-gray-800 hover:bg-blue-700 rounded-full font-semibold transition-colors">
            See More
          </button>
        </Link>
      </div>
    </section>
  );
}

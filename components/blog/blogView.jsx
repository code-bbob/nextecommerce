"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import BlogFooter from "./blogFooter";
import Plugins from "./plugins";
import Footer from "../Footer.server";

const BLOGS_PER_PAGE = 3; // Define constant for blogs per page

export default function BlogsView({ blogData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Memoize the handleClick function to prevent unnecessary re-renders
  const handleClick = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, [setCurrentPage]);

  // Calculate pagination indices based on currentPage and constant
  const indexOfLastBlog = currentPage * BLOGS_PER_PAGE;
  const indexOfFirstBlog = indexOfLastBlog - BLOGS_PER_PAGE;
  const currentBlogs = blogData.slice(indexOfFirstBlog, indexOfLastBlog);

  // Calculate the total number of pages
  const totalPages = Math.ceil(blogData.length / BLOGS_PER_PAGE);

  return (
    <>
      <div className="text-white bg-fixed mx-auto flex flex-wrap py-6">
        <section className="md:w-3/5 flex flex-col items-center px-3">
          {currentBlogs.map((blog) => (
            <article
              key={blog.id}
              onClick={() => router.push(`/blog/${blog.id}`)}
              className="flex flex-col w-[50vw] shadow-2xl my-4 cursor-pointer"
            >
              <div className="hover:opacity-75">
                <img
                  className="w-full h-80 object-cover" // Use object-cover for better image scaling
                  src={blog?.image}
                  alt={blog?.title}
                  loading="lazy" // Add lazy loading for performance
                />
              </div>
              <div className="bg-gray-800 flex flex-col justify-start p-6">
                <p className="text-white text-sm font-bold uppercase pb-4">
                  {blog?.category}
                </p>
                <h2 className="text-3xl font-bold hover:text-gray-700 pb-4">
                  {blog?.title} {/* Use h2 for better semantic structure */}
                </h2>
                <p className="text-sm pb-3">
                  By{" "}
                  <a
                    href="#"
                    className="font-semibold hover:text-gray-800"
                  >
                    {blog?.author}
                  </a>
                  , Published on {blog?.date}
                </p>
                <div // Use a div for the content to manage potential overflow
                  className="pb-6 break-words" // Add overflow hidden to the content area
                  dangerouslySetInnerHTML={{
                    __html:
                      blog?.content && blog?.content.length > 150
                        ? `${blog?.content.slice(0, 150)}...`
                        : blog?.content,
                  }}
                />
                <a
                  href={`/blog/${blog.id}`} // Link directly to the blog post
                  className="uppercase text-blue-800 hover:text-black"
                >
                  Continue Reading <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </article>
          ))}
          {/* Pagination */}
          {totalPages > 1 && ( // Conditionally render pagination if there's more than one page
            <div className="flex items-center py-8">
              {Array.from({ length: totalPages }, (_, index) => (
                <button // Use button for accessibility
                  key={index + 1}
                  onClick={() => handleClick(index + 1)}
                  className={`h-10 w-10 font-semibold text-gray-800 hover:text-gray-900 text-sm flex items-center justify-center ml-3 ${
                    currentPage === index + 1
                      ? "bg-blue-800 text-white"
                      : "bg-gray-500 hover:bg-blue-600"
                  }`}
                  aria-current={currentPage === index + 1 ? "page" : undefined} // Improve accessibility
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handleClick(currentPage + 1)}
                className={`h-10 w-10 font-semibold text-gray-800 bg-black hover:text-gray-900 text-sm flex items-center justify-center ml-3 px-3 ${
                  currentPage === totalPages ? " text-gray-400 cursor-default" : "text-white hover:bg-blue-600"
                }`}
                disabled={currentPage === totalPages} // Disable button at the last page
              >
                Next <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          )}
        </section>

        {/* <Plugins /> */}
      </div>
    </>
  );
}
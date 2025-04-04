"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BlogFooter from "./blogFooter";
import Plugins from "./plugins";
import Footer from "../Footer.server";

export default function BlogsView({ blogData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 3; // Number of blogs to display per page
  const router = useRouter();

  // Use the server-fetched data
  const blog = blogData;

  // Calculate pagination indices
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blog.slice(indexOfFirstBlog, indexOfLastBlog);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="text-white bg-fixed mx-auto flex flex-wrap py-6">
        <section className="md:w-3/5 flex flex-col items-center px-3">
          {currentBlogs.map((b) => (
            <article
              key={b.id}
              onClick={() => router.push(`/blog/${b.id}`)}
              className="flex flex-col w-[50vw] shadow-2xl my-4 cursor-pointer"
            >
              <div className="hover:opacity-75">
                <img className="w-100 h-80" src={b?.image} alt={b?.title} />
              </div>
              <div className="bg-gray-800 flex flex-col justify-start p-6">
                <p className="text-white text-sm font-bold uppercase pb-4">
                  {b?.category}
                </p>
                <p className="text-3xl font-bold hover:text-gray-700 pb-4">
                  {b?.title}
                </p>
                <p className="text-sm pb-3">
                  By{" "}
                  <a href="#" className="font-semibold hover:text-gray-800">
                    {b?.author}
                  </a>
                  , Published on {b?.date}
                </p>
                  
                  <p className="pb-6" 
                  dangerouslySetInnerHTML={{ __html: b?.content && b?.content.length > 100
                    ? `${b?.content.slice(0, 150)}...`
                    : b?.content} }
                  
                />
                <a
                  href="#"
                  className="uppercase text-blue-800 hover:text-black"
                >
                  Continue Reading <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </article>
          ))}
          {/* Pagination */}
          <div className="flex items-center py-8">
            {Array.from(
              { length: Math.ceil(blog.length / blogsPerPage) },
              (_, index) => (
                <a
                  key={index}
                  href="#"
                  className={`h-10 w-10 font-semibold text-gray-800 hover:text-gray-900 text-sm flex items-center justify-center ml-3 ${
                    currentPage === index + 1
                      ? "bg-blue-800 text-white"
                      : "bg-gray-500 hover:bg-blue-600"
                  }`}
                  onClick={() => handleClick(index + 1)}
                >
                  {index + 1}
                </a>
              )
            )}
            <a
              href="#"
              className={`h-10 w-10 font-semibold text-gray-800 bg-black hover:text-gray-900 text-sm flex items-center justify-center ml-3 px-8 ${
                currentPage === Math.ceil(blog.length / blogsPerPage)
                  ? " text-gray-400"
                  : "text-white  hover:bg-blue-600"
              }`}
              onClick={() => handleClick(currentPage + 1)}
            >
              Next <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </section>

        <Plugins />
      </div>
    </>
  );
}

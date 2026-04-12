"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const BLOGS_PER_PAGE = 12;

// Separate featured (written by author) and regular blogs
const separateBlogs = (blogs) => {
  const featured = blogs
    .filter(b => b.is_featured_by_author)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const regular = blogs
    .filter(b => !b.is_featured_by_author)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return { featured, regular };
};

export default function BlogsView({ blogData = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { featured, regular } = separateBlogs(blogData);
  
  // Combine: featured first, then regular
  const sortedBlogs = [...featured, ...regular];

  const handleClick = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const indexOfLastBlog = currentPage * BLOGS_PER_PAGE;
  const indexOfFirstBlog = indexOfLastBlog - BLOGS_PER_PAGE;
  const currentBlogs = sortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(sortedBlogs.length / BLOGS_PER_PAGE);

  if (!blogData?.length) {
    return (
      <div className="rounded-2xl border bg-white shadow-sm p-8 text-center my-12">
        <h2 className="text-lg font-semibold">No blog posts yet</h2>
        <p className="text-sm text-muted-foreground mt-1">Check back soon for tips, news, and reviews.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8">
      {/* Featured Section - Only show if there are featured posts */}
      {featured.length > 0 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">📌 Featured Articles</h2>
            <p className="text-sm text-gray-600 mt-1">Expert picks from our team</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featured.slice(0, 2).map((blog) => (
              <article
                key={blog.id}
                className="group relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
                onClick={() => router.push(`/blog/${blog.id}`)}
              >
                {/* Image Container */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-gray-100">
                  {blog?.image ? (
                    <Image
                      src={blog.image}
                      alt={blog?.title || "Blog cover"}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={true}
                      quality={85}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    {blog?.is_featured_by_author && (
                      <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 ring-1 ring-amber-300 px-2.5 py-0.5 text-xs font-bold">
                        ⭐ Featured
                      </span>
                    )}
                    {blog?.category && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 ring-1 ring-blue-300 px-2.5 py-0.5 text-xs font-medium">
                        {blog.category}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">
                    {blog?.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">
                    By <span className="font-semibold text-gray-800">{blog?.author || "Team"}</span> • {blog?.date}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-4 flex-grow">
                    {blog?.meta_description || (blog?.content?.replace(/<[^>]*>/g, '').slice(0, 100) + '...')}
                  </p>
                  <Link href={`/blog/${blog.id}`} className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900 group/link">
                    Read full article <span className="ml-2 group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Main Grid Section */}
      <section className="space-y-6">
        {featured.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900">Latest Articles</h2>
            <p className="text-sm text-gray-600 mt-1">Stay updated with tech news and reviews</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentBlogs.map((blog) => (
            <article
              key={blog.id}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
              onClick={() => router.push(`/blog/${blog.id}`)}
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                {blog?.image ? (
                  <Image
                    src={blog.image}
                    alt={blog?.title || "Blog cover"}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    quality={80}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  {blog?.category && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200 px-2 py-0.5 text-xs font-medium">
                      {blog.category}
                    </span>
                  )}
                  {blog?.is_featured_by_author && (
                    <span className="text-amber-600 text-xs font-bold">⭐</span>
                  )}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">
                  {blog?.title}
                </h3>
                <p className="text-xs text-gray-600 mb-3">
                  By <span className="font-medium text-gray-800">{blog?.author || "Team"}</span> · {blog?.date}
                </p>
                <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 mb-3 flex-grow">
                  {blog?.meta_description || (blog?.content?.replace(/<[^>]*>/g, '').slice(0, 80) + '...')}
                </p>
                <Link href={`/blog/${blog.id}`} className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center group/link">
                  Read more <span className="ml-1 group-hover/link:translate-x-0.5 transition-transform">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-12 p-6 bg-white rounded-xl border border-gray-200 shadow-sm" aria-label="pagination">
          <button
            onClick={() => handleClick(Math.max(currentPage - 1, 1))}
            className={`h-12 rounded-lg px-6 text-sm font-bold border-2 transition transform hover:scale-105 ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-300 hover:from-blue-100 hover:to-blue-200 hover:border-blue-400"
            }`}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2 flex-wrap justify-center">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1;
              // Show first page, last page, current page, and neighbors
              const isVisible = 
                pageNum === 1 || 
                pageNum === totalPages || 
                Math.abs(pageNum - currentPage) <= 1;

              if (!isVisible && index > 0 && index < totalPages - 1) {
                if (index === 1) return <span key="dots1" className="px-3 text-gray-400 font-bold">...</span>;
                if (index === totalPages - 2) return <span key="dots2" className="px-3 text-gray-400 font-bold">...</span>;
                return null;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handleClick(pageNum)}
                  className={`h-12 w-12 rounded-lg text-sm font-bold border-2 transition transform hover:scale-110 ${
                    currentPage === pageNum
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-700 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-600"
                  }`}
                  aria-current={currentPage === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleClick(Math.min(currentPage + 1, totalPages))}
            className={`h-12 rounded-lg px-6 text-sm font-bold border-2 transition transform hover:scale-105 ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-300 hover:from-blue-100 hover:to-blue-200 hover:border-blue-400"
            }`}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>

          {/* Page Info */}
          <div className="text-sm text-gray-600 font-medium ml-2">
            Page <span className="text-blue-600 font-bold">{currentPage}</span> of <span className="text-blue-600 font-bold">{totalPages}</span>
          </div>
        </nav>
      )}
    </div>
  );
}

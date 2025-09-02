"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BLOGS_PER_PAGE = 6;

export default function BlogsView({ blogData = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleClick = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const indexOfLastBlog = currentPage * BLOGS_PER_PAGE;
  const indexOfFirstBlog = indexOfLastBlog - BLOGS_PER_PAGE;
  const currentBlogs = blogData.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogData.length / BLOGS_PER_PAGE);

  if (!blogData?.length) {
    return (
      <div className="rounded-2xl border bg-white shadow-sm p-8 text-center">
        <h2 className="text-lg font-semibold">No blog posts yet</h2>
        <p className="text-sm text-muted-foreground mt-1">Check back soon for tips, news, and reviews.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBlogs.map((blog) => (
          <article
            key={blog.id}
            className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md cursor-pointer"
            onClick={() => router.push(`/blog/${blog.id}`)}
          >
            <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
              <img
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                src={blog?.image}
                alt={blog?.title || "Blog cover"}
                loading="lazy"
              />
            </div>
            <div className="p-4">
              {blog?.category && (
                <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200 px-2 py-0.5 text-xs font-medium">
                  {blog.category}
                </span>
              )}
              <h2 className="mt-2 line-clamp-2 text-base font-semibold tracking-tight group-hover:text-blue-700">
                {blog?.title}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                By <span className="font-medium text-foreground">{blog?.author || "Team"}</span> · {blog?.date}
              </p>
              <div
                className="mt-3 text-sm text-foreground/80 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html:
                    blog?.content && blog?.content.length > 180
                      ? `${blog?.content.slice(0, 180)}...`
                      : blog?.content || "",
                }}
              />
              <div className="mt-4">
                <Link href={`/blog/${blog.id}`} className="text-sm font-medium text-blue-700 hover:underline">
                  Continue reading →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {totalPages > 1 && (
    <nav className="flex items-center justify-center gap-2" aria-label="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handleClick(index + 1)}
      className={`h-9 w-9 rounded-md px-0 text-sm font-medium border transition ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-foreground hover:bg-slate-50 border-slate-200"
              }`}
              aria-current={currentPage === index + 1 ? "page" : undefined}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handleClick(Math.min(currentPage + 1, totalPages))}
            className={`h-9 rounded-md px-3 text-sm font-medium border transition ${
              currentPage === totalPages
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                : "bg-white text-foreground hover:bg-slate-50 border-slate-200"
            }`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

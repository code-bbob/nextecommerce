// app/blog/[id]/page.jsx
import BlackNavBar from "@/components/blackNavbar";
import Footer from "@/components/Footer.server";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const site = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  
  try {
    const res = await fetch(`${site}blog/api/${id}`, { next: { revalidate: 300 } });
    if (res.ok) {
      const blog = await res.json();
      const post = blog?.[0];
      if (post) {
        const description = post.meta_description || post.content?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Read the latest tech news and reviews from Digitech Enterprises Nepal.';
        const title = post.seo_title || post.title;
        const keywords = post.meta_keywords || `${post.category}, tech blog Nepal, ${post.title}`;
        
        return {
          title: `${title} | Digitech Blog`,
          description: description,
          keywords: keywords,
          authors: post.author ? [{ name: post.author }] : undefined,
          openGraph: {
            title: `${post.title}`,
            description: description,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author || 'Digitech Team'],
            images: post.image ? [{
              url: post.image,
              width: 1200,
              height: 630,
              alt: post.title,
            }] : undefined,
          },
          twitter: {
            card: 'summary_large_image',
            title: `${post.title}`,
            description: description,
            images: post.image ? [post.image] : undefined,
          },
        };
      }
    }
  } catch (err) {
    console.log('Failed to generate blog metadata', err);
  }
  
  return {
    title: 'Blog Post | Digitech Enterprises',
    description: 'Read the latest tech news and reviews from Digitech Enterprises Nepal.',
  };
}

// Generate Article Schema
function ArticleSchema({ blog }) {
  if (!blog) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': blog.title,
    'description': blog.meta_description || blog.content?.replace(/<[^>]*>/g, '').substring(0, 160),
    'image': blog.image,
    'datePublished': blog.date,
    'dateModified': blog.date,
    'author': {
      '@type': 'Person',
      'name': blog.author || 'Digitech Team',
    },
    'articleBody': blog.content?.replace(/<[^>]*>/g, ''),
  };
}

export default async function SingleBlog({ params }) {
  const { id } = await params;
  const site = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  let blog = [];
  let allBlogs = [];
  
  try {
    const res = await fetch(`${site}blog/api/${id}`, { next: { revalidate: 300 } });
    if (res.ok) {
      blog = await res.json();
    }
  } catch (err) {
    console.log('Failed to load blog', err);
  }

  // Fetch all blogs for sidebar
  try {
    const res = await fetch(`${site}blog/api/`, { next: { revalidate: 120 } });
    if (res.ok) {
      allBlogs = await res.json();
    }
  } catch (err) {
    console.log('Failed to load all blogs for sidebar', err);
  }

  const post = blog?.[0];
  // Get related blogs (exclude current post, show more items)
  const relatedBlogs = allBlogs
    .filter(b => b.id !== id)
    .sort((a, b) => (b.is_featured_by_author ? 1 : 0) - (a.is_featured_by_author ? 1 : 0))
    .slice(0, 8);
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <BlackNavBar color="inherit" />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Blog post not found</h1>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            ← Back to all blogs
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ArticleSchema({ blog: post })) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <BlackNavBar color="inherit" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/blog" className="hover:text-blue-600 transition">Blogs</Link>
            <span>/</span>
            {post?.category && <span className="text-blue-600 font-medium">{post.category}</span>}
          </div>

          {/* Main Layout: Content + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Article - takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Hero Image */}
                {post?.image && (
                  <div className="relative w-full h-96 sm:h-[500px] bg-gray-100 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title || "Blog cover"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
                      priority={true}
                      quality={90}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 sm:p-8 md:p-10">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {post?.category && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 ring-1 ring-blue-300 px-3 py-1 text-sm font-semibold">
                    {post.category}
                  </span>
                )}
                {post?.is_featured_by_author && (
                  <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 ring-1 ring-amber-300 px-3 py-1 text-sm font-bold">
                    ⭐ Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post?.title}
              </h1>

              {/* Author & Date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-6 border-b border-gray-200 mb-6 text-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    {post?.author?.[0]?.toUpperCase() || 'D'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{post?.author || 'Digitech Team'}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{post?.date}</p>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                  <span>📖</span>
                  <span>{Math.ceil(post?.content?.split(' ').length / 200)} min read</span>
                </div>
              </div>

              {/* Article Body */}
              <div
                className="prose prose-sm sm:prose sm:max-w-none text-gray-700 leading-7 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-gray-900 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-gray-800 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:ml-4 [&_li]:mb-2 [&_img]:rounded-xl [&_img]:my-6 [&_img]:shadow-md [&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:hover:underline [&_strong]:font-bold [&_strong]:text-gray-900 [&_em]:italic [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:my-4"
                style={{ wordBreak: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: post?.content || '' }}
              />

              {/* Back Button */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <Link 
                  href="/blog"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition"
                >
                  ← Back to all blogs
                </Link>
              </div>
            </div>
          </article>
            </div>

            {/* Sidebar - Other Blog Posts */}
            {relatedBlogs.length > 0 && (
              <aside className="lg:col-span-1">
                <div className="sticky top-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📚</span> More Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedBlogs.map((relatedBlog) => (
                      <Link
                        key={relatedBlog.id}
                        href={`/blog/${relatedBlog.id}`}
                        className="block group"
                      >
                        <article className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-300">
                          {/* Thumbnail */}
                          {relatedBlog?.image && (
                            <div className="relative h-32 w-full overflow-hidden bg-gray-200">
                              <Image
                                src={relatedBlog.image}
                                alt={relatedBlog?.title || "Blog thumbnail"}
                                fill
                                className="object-cover group-hover:scale-110 transition duration-300"
                                sizes="300px"
                                loading="lazy"
                                quality={75}
                              />
                            </div>
                          )}
                          
                          {/* Content */}
                          <div className="p-3">
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition">
                              {relatedBlog?.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {relatedBlog?.author || 'Digitech Team'}
                            </p>
                            <p className="text-xs text-gray-700 mt-2 line-clamp-2">
                              {relatedBlog?.meta_description || (relatedBlog?.content?.replace(/<[^>]*>/g, '').slice(0, 75) + '...')}
                            </p>
                            {relatedBlog?.is_featured_by_author && (
                              <span className="inline-block mt-2 text-xs font-bold text-amber-600">⭐ Featured</span>
                            )}
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                  
                  {/* View All Link */}
                  <Link
                    href="/blog"
                    className="mt-6 block w-full text-center py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg font-semibold hover:from-blue-100 hover:to-blue-200 transition"
                  >
                    View All Articles →
                  </Link>
                </div>
              </aside>
            )}
          </div>

          {/* Related/Bottom CTA */}
          <div className="mt-12 p-6 sm:p-8 bg-gray-500 rounded-xl text-white text-center">
            <h3 className="text-lg font-bold mb-2">Enjoyed this article?</h3>
            <p className="text-blue-100 mb-4">Explore more tech tips, reviews, and buying guides</p>
            <Link 
              href="/blog"
              className="inline-block px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Read More Articles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

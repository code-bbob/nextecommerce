import BlackNavBar from '@/components/blackNavbar';
import BlogsView from '@/components/blog/blogView';
import Footer from '@/components/Footer.server';

export const revalidate = 120; // Cache the blog index for 2 minutes

export const metadata = {
  title: 'Tech Blog & News | Digitech Enterprises Nepal - Expert Reviews & Tips',
  description: 'Discover latest tech news, laptop reviews, smartphone guides, and expert tech tips from Nepal\'s leading tech store. Fast-loading, SEO-optimized content for tech enthusiasts.',
  keywords: 'tech blog Nepal, laptop reviews, smartphone news, tech tips, buying guides, tech reviews, digitech blog',
  openGraph: {
    title: 'Tech Blog & News | Digitech Enterprises',
    description: 'Expert tech reviews, news, and buying guides from Nepal\'s leading tech store.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Blog & News | Digitech Enterprises',
    description: 'Expert tech reviews, news, and buying guides from Nepal\'s leading tech store.',
  },
};

// Blog Collection Schema
function BlogCollectionSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Tech Blog & News',
    'description': 'Latest tech news, product reviews, buying guides, and tips from Nepal\'s leading tech store.',
    'url': 'https://www.dgtechcm.np/blog',
  };
}

export default async function BlogPage() {
  const site = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  let blog = [];
  let mblogs = [];

  try {
    const res = await fetch(`${site}blog/api/`, { next: { revalidate: 120 } });
    if (res.ok) {
      blog = await res.json();
      mblogs = [...new Set(blog?.map((b) => b.category))];
    }
  } catch (err) {
    console.log('Failed to load blogs', err);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BlogCollectionSchema()) }}
      />
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-foreground font-sans'>
        <BlackNavBar color="inherit"/>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <header className="py-12 sm:py-16 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
              Tech Blog & News
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mb-2">
              Expert reviews, buying guides, and the latest tech news from Nepal
            </p>
            {mblogs?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <span className="text-sm text-gray-600">Categories:</span>
                {mblogs.slice(0, 5).map((cat, idx) => (
                  <span key={idx} className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Main Content */}
          <BlogsView blogData={blog} />
        </main>
        <Footer />
      </div>
    </>
  );
}

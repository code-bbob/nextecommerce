import BlackNavBar from '@/components/blackNavbar';
import BlogsView from '@/components/blog/blogView';
import Footer from '@/components/Footer.server';

export const revalidate = 120; // Cache the blog index for 2 minutes

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
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-foreground font-sans'>
      <BlackNavBar color="inherit"/>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <header className="mb-4 text-center">
          {/* <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Latest from our blog</h1> */}
          {mblogs?.length > 0 && (
            <p className="text-sm md:text-base text-muted-foreground mt-2">Tips, news, and reviews from Nepal’s tech scene</p>
          )}
        </header>
        <BlogsView blogData={blog} />
      </main>
      <Footer />
    </div>
  );
}

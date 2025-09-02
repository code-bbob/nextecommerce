// app/blog/[id]/page.jsx
import BlackNavBar from "@/components/blackNavbar";
import Footer from "@/components/Footer.server";

export default async function SingleBlog({ params }) {
  const { id } = await params;
  const site = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  let blog = [];
  try {
    const res = await fetch(`${site}blog/api/${id}`, { next: { revalidate: 300 } });
    if (res.ok) {
      blog = await res.json();
    }
  } catch (err) {
    console.log('Failed to load blog', err);
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-foreground">
      <BlackNavBar color="inherit" />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {blog?.[0]?.image && (
            <div className="w-full">
              <img
                src={blog[0].image}
                alt={blog[0].title || "Blog cover"}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          <div className="p-6 md:p-8">
            {blog?.[0]?.category && (
              <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200 px-2 py-0.5 text-xs font-medium">
                {blog[0].category}
              </span>
            )}
            <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight">
              {blog?.[0]?.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              By <span className="font-medium text-foreground">{blog?.[0]?.author || 'Team'}</span> · {blog?.[0]?.date}
            </p>
            <div
              className="mt-6 text-base leading-7 [&_img]:rounded-xl"
              style={{ wordBreak: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: blog?.[0]?.content || '' }}
            />
          </div>
        </article>

      </main>
      <Footer />
    </div>
  );
}

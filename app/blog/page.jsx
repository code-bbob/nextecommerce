// pages/blog/index.js (or another appropriate page)
import BlogHeader from '@/components/blog/blogHeader';
import BlogsView from '@/components/blog/blogView';
import customFetch from '@/utils/customFetch';

export default async function BlogPage() {
  // Declare variables in the outer scope
  let blog = [];
  let mblogs = [];
  
  try {
    const res = await customFetch('blog/api/', {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    blog = await res.json();
    mblogs = [...new Set(blog?.map((blogs) => blogs.category))];
  } catch (err) {
    console.log("err ayo", err);
  }

  return (
    <>
      <BlogHeader blog={mblogs} />
      <BlogsView blogData={blog} />
    </>
  );
}

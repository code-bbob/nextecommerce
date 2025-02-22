// pages/blog/index.js (or another appropriate page)
import BlogHeader from '@/components/blog/blogHeader';
import BlogsView from '@/components/blog/blogView';
import customFetch from '@/utils/customFetch';
export default async function BlogPage() {
    try{
    const res = await customFetch('blog/api/', {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    const blog = await res.json();
    
    const mblogs = [...new Set(blog?.map((blogs) => blogs.category))]; 
}
    catch(err){
        console.log(err)
    }

  
    return (
      <>
        <BlogHeader blog={mblogs} />
        <BlogsView blogData={blog} />
      </>
    );
  }
  
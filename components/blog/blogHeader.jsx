"use client";
import { useRouter } from "next/navigation";
import { FaSearch, FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import Link from 'next/link';

export default function BlogHeader({ blog }) {
  const router = useRouter();

  return (
    <>
      <nav className="w-full py-2 bg-black shadow flex">
        <Link href="/">
          <img className="h-30 w-44" src="/digi.jpg" alt="oop" />
        </Link>
        <div className="w-full container mx-auto flex flex-wrap items-center justify-between">
          <nav>
            <ul className="flex items-center justify-between font-bold text-sm text-white uppercase no-underline">
              <li>
                <Link href="/" className="hover:text-gray-200 no-underline text-white hover:underline px-4">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-gray-200 no-underline text-white hover:underline px-4">
                  Blog
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex justify-between items-center rounded-md w-80">
            <input
              className="outline-none w-full p-2"
              type="search"
              placeholder="Search Your Blogs Here"
            />
            <FaSearch className="bg-orange-400 h-10 w-8 p-1 hover:bg-orange-600" />
          </div>
          <div className="flex items-center text-lg no-underline text-white pr-6 gap-4">
            <Link href="https://facebook.com" className="text-white">
              <FaFacebook size={30} />
            </Link>
            <Link href="https://instagram.com" className="text-white">
              <FaInstagram size={30} />
            </Link>
            <Link href="https://twitter.com" className="text-white">
              <FaTwitter size={30} />
            </Link>
          </div>
        </div>
      </nav>
      <header className="w-full container mx-auto">
        <div className="flex flex-col items-center py-12">
          <a className="text-gray-800 no-underline uppercase hover:text-gray-700 text-5xl" href="#">
            DGTech Blog
          </a>
          <p className="text-lg text-gray-600">For your next purchase</p>
        </div>
      </header>
      <nav className="w-full py-4 border-t border-b bg-gray-100">
        <div className="w-full flex-grow sm:flex sm:items-center sm:w-auto">
          <div className="w-full container mx-auto flex flex-col sm:flex-row items-center justify-center text-sm font-bold uppercase mt-0 px-6 py-2">
            {blog.map((b) => (
              <div
                key={b}
                onClick={() => router.push(`/blog/cat/${b}`)}
                className="hover:bg-gray-400 no-underline text-black hover:underline rounded py-2 px-4 mx-2"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

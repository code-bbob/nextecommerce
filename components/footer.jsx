import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-black via-gray-600 to-black text-white py-8 md:py-4 px-4 md:px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-1">Bibhab Basnet</h3>
            <p className="text-gray-400">&copy; {new Date().getFullYear()} All rights reserved.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-12">
            <Link href="/about" className="hover:text-red-400 transition duration-300">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-red-400 transition duration-300">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-red-400 transition duration-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
  )
}


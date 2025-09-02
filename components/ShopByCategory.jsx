import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Laptops", href: "/laptop", image: "/images/laptop.webp" },
  { name: "Smartphones", href: "/smartphone", image: "/images/smartphone.jpg" },
  { name: "Keyboards", href: "/keyboard", image: "/images/keyboard.webp" },
  { name: "Monitors", href: "/monitor", image: "/images/monitor.webp" },
  { name: "Headphones", href: "/headphone", image: "/images/headphone.webp" },
  { name: "Gadgets", href: "/gadgets", image: "/images/gadget.jpg" },
  { name: "Smartwatches", href: "/smartwatch", image: "/images/smartwatch.jpg" },
  { name: "Printers", href: "/printers", image: "/images/printer.webp" },
  { name: "Accessories", href: "/accessories", image: "/images/accessories.jpg" },
  { name: "Custom PC", href: "/custom-pc", image: "/images/case.jpg" },
];

export default function ShopByCategory() {
  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Pick From Our Top Categories
          </h2>
          <p className="text-md text-gray-500 mt-2">
            Find the best tech from our curated collections.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 md:gap-6">
          {categories.map((category, index) => (
            <Link
              href={`${category.href}`}
              key={category.name}
              className="group text-center transition-transform duration-300 ease-in-out hover:!transform-none"
            >
              <div
                className="relative aspect-square mx-auto mb-3 rounded-full overflow-hidden 
                           border-4 border-white shadow-lg 
                           transition-all duration-300 ease-in-out
                           group-hover:shadow-xl group-hover:border-blue-400"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

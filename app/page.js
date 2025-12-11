import Testimonials from "@/components/Testimonials.client";
import BlackNavBar from "@/components/blackNavbar";
import OurServices from "@/components/ourServices";
import BrandLogos from "@/components/BrandLogos";
import MosaicHero from "@/components/MosaicHero";
import MinimalProductGrid from "@/components/MinimalProductGrid";
import ShopByCategory from "@/components/ShopByCategory";
import ProductShowcase from "@/components/ProductShowcase.client";
import DealsOfDay from "@/components/DealsOfDay.client";
import TopLaptops from "@/components/TopLaptops.client";
import LaptopSlider from "@/components/LaptopSlider.client";
import CatBar from "@/components/catbar";
import BlogSlider from "@/components/blogsSlider";
import FirstBanners from "@/components/firstBanners";
import SecondBanners from "@/components/secondBanners";
import Footer from "@/components/Footer.server";

// ISR - Revalidate every 1 hour
export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title:
      "Digitech Enterprises |EMI with Authorized, Authentic & Trusted Tech Store in Nepal",
    description:
      "Discover Nepal’s leading tech store at Digitech Enterprises. We offer emi on genuine products, expert support, company warranties, and unbeatable deals on laptops, smartphones, and more. Experience quality service, the latest technology trends, and innovative gadgets at your fingertips.",
    keywords:
      "Digitech Enterprises, Digitech Nepal, Laptops on EMI, Mobile phones in EMI",
  };
}

export default function Page() {
  return (
    <>
      <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 min-h-screen relative">
        <BlackNavBar color="white" />
        <CatBar />
        <main className="mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-10 pb-14">
          <MosaicHero />
          <ShopByCategory />
          {/* <TopLaptops /> */}
          <LaptopSlider />
          <FirstBanners />
          <DealsOfDay />
          <SecondBanners />
          <MinimalProductGrid />
          <BrandLogos />
          <ProductShowcase />
          <Testimonials />
          {/* <OurServices/> */}
          <BlogSlider />
        </main>
        <Footer />
      </div>
    </>
  );
}

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
import BlogSlider from "@/components/blogsSlider";
import FirstBanners from "@/components/firstBanners";
import SecondBanners from "@/components/secondBanners";
import Footer from "@/components/Footer.server";

// ISR - Revalidate every 1 hour
export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title:
      "Buy Laptops & Smartphones on EMI in Nepal | Digitech Enterprises",
    description:
      "Nepal's most trusted tech store offering laptops, smartphones & accessories on EMI. Authorized brands, genuine products, official warranties. Fast delivery in Kathmandu & Pokhara. Shop now!",
    keywords:
      "Digitech Enterprises, Digitech Nepal, Laptops on EMI, Mobile phones on EMI, buy laptops Nepal, smartphones Kathmandu",
  };
}

export default function Page() {
  return (
    <>
      <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 min-h-screen relative">
        <BlackNavBar color="white" />
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

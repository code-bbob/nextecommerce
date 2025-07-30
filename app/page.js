import NavBar from "@/components/navbar";
import HeroCarousel from "@/components/HeroCarousel.client";
import CountdownTimer from "@/components/CountdownTimer.client";
import FeaturedProducts from "@/components/FeaturedProducts.client";
import Testimonials from "@/components/Testimonials.client";
import Footer from "@/components/Footer.server";
import BlackNavBar from "@/components/blackNavbar";
import LaptopSlider from "@/components/LaptopSlider.client";
import OurServices from "@/components/ourServices";
import BlogSlider from "@/components/blogsSlider";
import BrandLogos from "@/components/BrandLogos";


export async function generateMetadata() {
  return {
    title: 'Digitech Enterprises |EMI with Authorized, Authentic & Trusted Tech Store in Nepal',
    description: 'Discover Nepal’s leading tech store at Digitech Enterprises. We offer emi on genuine products, expert support, company warranties, and unbeatable deals on laptops, smartphones, and more. Experience quality service, the latest technology trends, and innovative gadgets at your fingertips.',
    keywords: 'Digitech Enterprises, Digitech Nepal, Laptops on EMI, Mobile phones in EMI'
  }
}

export default function Page() {
  return (
    <>
      <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 min-h-screen">
        <BlackNavBar color="white"/>
        <main className="container mx-auto px-6">
          <HeroCarousel />
          <CountdownTimer />
          <FeaturedProducts />
          <Testimonials />
          <LaptopSlider/>
          <BrandLogos/>
          <OurServices/>
          <BlogSlider/>
        </main>
        <Footer />
      </div>
    </>
  );
}

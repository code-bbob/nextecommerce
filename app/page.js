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



export const metadata = {
  title: 'Digitech Enterprises |EMI with Authorized, Authentic & Trusted Tech Store in Nepal',
  description: 'Discover Nepal’s leading tech store at Digitech Enterprises. We offer emi on genuine products, expert support, company warranties, and unbeatable deals on laptops, smartphones, and more. Experience quality service, the latest technology trends, and innovative gadgets at your fingertips.',
  keywords: 'tech store Nepal, laptops Nepal, smartphones Nepal, electronics Nepal, genuine tech products, tech deals, trusted tech store, tech support Nepal, authorized laptop, digital gadgets, Nepal technology trends, laptop price in nepal, smartphone price in nepal',
}

export default function Page() {
  return (
    <>
      <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white">
        <BlackNavBar />
        <main className="container mx-auto px-6">
          <HeroCarousel />
          <CountdownTimer />
          <FeaturedProducts />
          <Testimonials />
          <LaptopSlider/>
          <OurServices/>
        <BlogSlider/>
        </main>
        <Footer />
      </div>
    </>
  );
}

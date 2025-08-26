import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import CartInitializer from "@/utils/cartInitializer";
import { Inter } from 'next/font/google'
import { Shadows_Into_Light } from "next/font/google";
 import { Playfair_Display } from "next/font/google";
 import { Newsreader } from "next/font/google";
 import { Poppins } from "next/font/google";
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const shadowsIntoLight = Shadows_Into_Light({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  weight: '500',
})

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
})



export const metadata = {
  title: "Digitech Enterprises |EMI with Authorized, Authentic & Trusted Tech Store in Nepal",
  description: "Discover Nepal’s leading tech store at Digitech Enterprises. We offer emi on genuine products, expert support, company warranties, and unbeatable deals on laptops, smartphones, and more. Experience quality service, the latest technology trends, and innovative gadgets at your fingertips.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
  <body className="bg-background min-h-screen antialiased">
        <Providers>
        <CartInitializer />
          {children}
          </Providers>
      </body>
    </html>
  );
}

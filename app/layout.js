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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"),
  title: {
    default:
      "Digitech Enterprises | EMI • Authorized, Authentic & Trusted Tech Store in Nepal",
    template: "%s | Digitech Enterprises",
  },
  description:
    "Discover Nepal’s leading tech store. EMI on genuine laptops, smartphones, and accessories. Kathmandu & Pokhara delivery. Authorized brands, company warranties, and unbeatable festive deals.",
  keywords: [
    "Nepal laptops",
    "smartphones Nepal",
    "buy laptops Nepal",
    "laptop accessories Nepal",
    "Kathmandu laptops",
    "Pokhara smartphones",
    "tech store Nepal",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-NP": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    siteName: "Digitech Enterprises",
    title: "Digitech Enterprises — Nepal’s Trusted Tech Store",
    description:
      "Buy laptops, smartphones, and accessories in Nepal. Fast delivery in Kathmandu and Pokhara. Authorized brands and EMI available.",
    url: "/",
    images: [
      {
        url: "/images/digi.jpg",
        width: 1200,
        height: 630,
        alt: "Digitech Enterprises",
      },
    ],
  locale: "en_NP",
  alternateLocales: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digitech Enterprises — Nepal’s Trusted Tech Store",
    description:
      "Buy laptops, smartphones, and accessories in Nepal. Kathmandu, Pokhara delivery. EMI and official warranties.",
    images: ["/images/digi.jpg"],
  site: "@digitech_nepal",
  creator: "@digitech_nepal",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
  <body className="bg-background min-h-screen antialiased">
        {/* Store JSON-LD for SEO (SSR) */}
        {(() => {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
          const phone = process.env.NEXT_PUBLIC_STORE_PHONE || undefined;
          const email = process.env.NEXT_PUBLIC_STORE_EMAIL || undefined;
          const logo = `${siteUrl}/images/digi.jpg`;
          const storeJsonLd = {
            "@context": "https://schema.org",
            "@type": "Store",
            name: "Digitech Enterprises",
            url: siteUrl,
            image: logo,
            logo,
            telephone: phone,
            email: email,
            address: {
              "@type": "PostalAddress",
              addressCountry: "NP",
              addressLocality: "Kathmandu",
              addressRegion: "Bagmati",
              streetAddress: "",
              postalCode: "44600"
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 27.7172,
              longitude: 85.3240
            },
            contactPoint: phone
              ? [
                  {
                    "@type": "ContactPoint",
                    telephone: phone,
                    contactType: "customer service",
                    areaServed: "NP",
                    availableLanguage: ["en", "ne"],
                  },
                ]
              : undefined,
            currenciesAccepted: "NPR",
            paymentAccepted: "Cash, Card, EMI",
            areaServed: ["Kathmandu", "Pokhara", "Nepal"],
            sameAs: []
          };
          const websiteJsonLd = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Digitech Enterprises",
            url: siteUrl,
            potentialAction: {
              "@type": "SearchAction",
              target: `${siteUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          };
          return (
            <script
              type="application/ld+json"
              // SSR inline JSON-LD
              dangerouslySetInnerHTML={{ __html: JSON.stringify([storeJsonLd, websiteJsonLd]) }}
            />
          );
        })()}
        <Providers>
        <CartInitializer />
          {children}
          </Providers>
      </body>
    </html>
  );
}

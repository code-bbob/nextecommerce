export const dynamic = "force-static";

export const metadata = {
  title: "Buy Laptops & Smartphones in Nepal | Store",
  description:
    "Browse laptops, smartphones, and accessories in Nepal. Fast Kathmandu & Pokhara delivery. Authorized brands, EMI and warranties.",
  keywords: [
    "Nepal laptops",
    "smartphones Nepal",
    "buy laptops Nepal",
    "laptop accessories Nepal",
    "Kathmandu laptops",
    "Pokhara smartphones",
  ],
  alternates: {
    canonical: "/store",
  },
  openGraph: {
    title: "Buy Laptops & Smartphones in Nepal | Store",
    description:
      "Browse laptops, smartphones, and accessories in Nepal. Fast Kathmandu & Pokhara delivery. Authorized brands, EMI and warranties.",
    url: "/store",
    type: "website",
    locale: "en_NP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Laptops & Smartphones in Nepal | Store",
    description:
      "Browse laptops, smartphones, and accessories in Nepal. Fast Kathmandu & Pokhara delivery.",
  },
};

export default function StoreLayout({ children }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site },
      { "@type": "ListItem", position: 2, name: "Store", item: `${site}/store` },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
      {children}
    </>
  );
}

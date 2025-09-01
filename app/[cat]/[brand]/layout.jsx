export const dynamic = "force-static";

import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd.server";

export async function generateMetadata({ params }) {
  const { cat, brand } = params || {};
  const title = `${brand} ${cat} in Nepal | Buy ${brand} ${cat}`;
  const description = `Shop ${brand} ${cat} at Digitech Enterprises. Buy in Nepal with fast delivery in Kathmandu and Pokhara. Official warranties & EMI.`;
  const keywords = [
    `${brand} ${cat} Nepal`,
    `${brand} ${cat} Kathmandu`,
    `${brand} ${cat} Pokhara`,
    "Nepal laptops",
    "smartphones Nepal",
    "buy laptops Nepal",
    "laptop accessories Nepal",
  ];
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const url = `${site}/${cat}/${brand}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", locale: "en_NP" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function BrandLayout({ children, params }) {
  const { cat, brand } = params || {};
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: site },
          { name: String(cat), item: `${site}/${cat}` },
          { name: String(brand), item: `${site}/${cat}/${brand}` },
        ]}
      />
      {children}
    </>
  );
}

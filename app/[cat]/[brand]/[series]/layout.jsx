export const dynamic = "force-static";

import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd.server";

export async function generateMetadata({ params }) {
  const { cat, brand, series } = params || {};
  const title = `${brand} ${series} ${cat} in Nepal | Buy Online`;
  const description = `Find ${brand} ${series} ${cat} in Nepal at Digitech Enterprises. Fast delivery to Kathmandu & Pokhara. Official warranties & EMI.`;
  const keywords = [
    `${brand} ${series} ${cat} Nepal`,
    `${brand} ${series} ${cat} Kathmandu`,
    `${brand} ${series} ${cat} Pokhara`,
    "Nepal laptops",
    "smartphones Nepal",
    "buy laptops Nepal",
    "laptop accessories Nepal",
  ];
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const url = `${site}/${cat}/${brand}/${series}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", locale: "en_NP" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function SeriesLayout({ children, params }) {
  const { cat, brand, series } = params || {};
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: site },
          { name: String(cat), item: `${site}/${cat}` },
          { name: String(brand), item: `${site}/${cat}/${brand}` },
          { name: String(series), item: `${site}/${cat}/${brand}/${series}` },
        ]}
      />
      {children}
    </>
  );
}

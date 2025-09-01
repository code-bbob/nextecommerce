export const dynamic = "force-static";

export async function generateMetadata({ params }) {
  const { cat } = await params;
  const title = `${cat} in Nepal | Buy ${cat} Online`;
  const description = `Explore ${cat} at Digitech Enterprises. Buy ${cat} in Nepal with fast delivery to Kathmandu and Pokhara. Official warranties and EMI available.`;
  const keywords = [
    `${cat} Nepal`,
    `${cat} Kathmandu`,
    `${cat} Pokhara`,
    "Nepal laptops",
    "smartphones Nepal",
    "buy laptops Nepal",
    "laptop accessories Nepal",
  ];
  const url = `/${cat}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", locale: "en_NP" },
    twitter: { card: "summary_large_image", title, description },
  };
}

import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd.server";

export default function CategoryLayout({ children, params }) {
  const cat = params?.cat;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: site },
          { name: String(cat), item: `${site}/${cat}` },
        ]}
      />
      {children}
    </>
  );
}

// Server component to inject BreadcrumbList JSON-LD
export default function BreadcrumbJsonLd({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.item,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

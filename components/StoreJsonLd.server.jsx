// Server component to inject Store JSON-LD for the ecommerce site in Nepal
export default function StoreJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const phone = process.env.NEXT_PUBLIC_STORE_PHONE || undefined;
  const email = process.env.NEXT_PUBLIC_STORE_EMAIL || undefined;
  const logo = `${siteUrl}/images/digi.jpg`;

  const json = {
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
      postalCode: "44600",
    },
    geo: { "@type": "GeoCoordinates", latitude: 27.7172, longitude: 85.324 },
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
    sameAs: [],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}

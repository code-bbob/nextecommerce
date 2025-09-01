export default function Head() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const cdn = "https://digitech-ecommerce.blr1.cdn.digitaloceanspaces.com";
  return (
    <>
      <meta name="theme-color" content="#000000" />
      {backend && <link rel="preconnect" href={backend} crossOrigin="anonymous" />}
      {backend && <link rel="dns-prefetch" href={backend} />}
      <link rel="preconnect" href={cdn} crossOrigin="anonymous" />
      <link rel="dns-prefetch" href={cdn} />
    </>
  );
}

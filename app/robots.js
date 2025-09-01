// app/robots.js
// Dynamic robots.txt for Next.js App Router

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "bingbot", allow: "/" },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}

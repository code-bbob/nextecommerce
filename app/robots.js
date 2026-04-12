// app/robots.js
// Dynamic robots.txt for Next.js App Router with blog prioritization

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.dgtechcm.np").replace(/\/$/, "");

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/checkout",
          "/cart",
          "/private",
          "/*.json$",
        ],
      },
      { 
        userAgent: "Googlebot", 
        allow: ["/", "/blog"],
        crawlDelay: 0,
      },
      { 
        userAgent: "bingbot", 
        allow: ["/", "/blog"],
        crawlDelay: 1,
      },
    ],
    sitemap: [
      `${SITE}/sitemap.xml`,
      `${SITE}/blog-sitemap.xml`,
    ],
    host: SITE,
  };
}

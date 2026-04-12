/**
 * Blog SEO Utilities
 * Generate meta tags, structured data, and optimize for search engines
 */

export const generateBlogMeta = (post) => {
  if (!post) return {};

  const description =
    post.meta_description ||
    post.content?.replace(/<[^>]*>/g, "").substring(0, 160) ||
    "Read our latest tech article";

  const title = post.seo_title || post.title;

  return {
    title: `${title} | Digitech Blog`,
    description,
    keywords: post.meta_keywords || `${post.category}, tech blog, ${post.title}`,
    authors: post.author ? [{ name: post.author }] : undefined,
    canonical: `https://www.dgtechcm.np/blog/${post.id}`,
  };
};

export const generateArticleSchema = (post) => {
  if (!post) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description:
      post.meta_description ||
      post.content?.replace(/<[^>]*>/g, "").substring(0, 160),
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author || "Digitech Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Digitech Enterprises Nepal",
      logo: {
        "@type": "ImageObject",
        url: "https://www.dgtechcm.np/logo.png",
      },
    },
    articleBody: post.content?.replace(/<[^>]*>/g, ""),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.dgtechcm.np/blog/${post.id}`,
    },
  };
};

export const generateBlogListSchema = (blogs) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tech Blog Posts",
    itemListElement: blogs.slice(0, 10).map((blog, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: blog.title,
      url: `https://www.dgtechcm.np/blog/${blog.id}`,
      image: blog.image,
      datePublished: blog.date,
      author: blog.author,
    })),
  };
};

export const extractKeywords = (content) => {
  if (!content) return [];

  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, "");

  // Common stop words
  const stopWords = new Set([
    "the",
    "is",
    "at",
    "which",
    "on",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "with",
    "to",
    "for",
    "of",
    "as",
    "by",
  ]);

  // Split and clean
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  // Count frequency
  const freq = {};
  words.forEach((word) => {
    freq[word] = (freq[word] || 0) + 1;
  });

  // Return top 10 keywords
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
};

export const calculateReadTime = (content) => {
  if (!content) return 0;
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  return Math.ceil(words / 200); // Average reading speed: 200 words/minute
};

export const generateBlogSitemap = (blogs) => {
  const baseUrl = "https://www.dgtechcm.np";

  const entries = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.id}`,
    lastmod: blog.date,
    changefreq: "monthly",
    priority: blog.is_featured_by_author ? 0.9 : 0.7,
  }));

  entries.unshift({
    url: `${baseUrl}/blog`,
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "daily",
    priority: 0.8,
  });

  return entries;
};

export const generateBlogRobotsMeta = (post) => {
  return {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  };
};

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

function buildUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;

  const base = (baseURL || "").replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${base}${normalizedPath}`;
}

export default async function publicFetch(path, options = {}) {
  return fetch(buildUrl(path), options);
}

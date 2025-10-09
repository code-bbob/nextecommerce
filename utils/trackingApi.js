import customFetch from "./customFetch";

// Status normalization map and preferred order
export const STATUS_ORDER = [
  "ORDER_PLACED",
  "ORDER_CONFIRMED",
  "VERIFICATION",
  "DISPATCHED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

export function normalizeStatus(value) {
  if (!value) return "ORDER_PLACED";
  const v = String(value).toLowerCase();
  if (/(out.*delivery)/.test(v)) return "OUT_FOR_DELIVERY";
  if (/(in.*transit)/.test(v)) return "IN_TRANSIT";
  if (/dispatch|shipped/.test(v)) return "DISPATCHED";
  if (/confirm/.test(v)) return "ORDER_CONFIRMED";
  if (/deliver\w*\b.*(success|ed|complete)/.test(v)) return "DELIVERED";
  if (/deliver\w*/.test(v)) return "OUT_FOR_DELIVERY";
  if (/verify|verification|phone/.test(v)) return "VERIFICATION";
  if (/cancel/.test(v)) return "CANCELLED";
  if (/return/.test(v)) return "RETURNED";
  if (/placed|created|new|pending/.test(v)) return "ORDER_PLACED";
  return v.toUpperCase().replaceAll(" ", "_");
}

function normalizeUpdate(u = {}) {
  return {
    timestamp: u.timestamp || u.time || u.updated_at || u.created_at || null,
    status: normalizeStatus(u.status || u.state || u.code || u.event),
    rawStatus: u.status || u.state || u.code || u.event || null,
    location: u.location || u.hub || u.city || null,
    message: u.message || u.note || u.description || null,
  };
}

function pick(obj, keys) {
  const out = {};
  keys.forEach((k) => {
    if (obj && obj[k] !== undefined) out[k] = obj[k];
  });
  return out;
}

function normalizeResponse(json) {
  // Try to detect common shapes and normalize.
  const base = {};

  if (!json) return null;

  // Some APIs nest under data
  const root = json.data && typeof json.data === "object" ? json.data : json;

  // If response has order object
  const order = root.order && typeof root.order === "object" ? root.order : root;

  const updatesArray =
    root.updates || root.history || root.tracking || order.updates || order.history || [];

  const normalized = {
    orderId: String(order.id || order.order_id || root.order_id || root.id || "").trim(),
    customerName:
      order.customer_name || order.customer || order.name || root.customer || root.customer_name || null,
    phone: order.phone || order.phone_number || root.phone || root.phone_number || null,
    email: order.email || root.email || null,
    shippingAddress:
      order.shipping_address || root.shipping_address || order.address || root.address || null,
    currentStatus: normalizeStatus(
      order.current_status || root.current_status || order.status || root.status || updatesArray?.[updatesArray.length - 1]?.status
    ),
    updatedAt:
      order.updated_at || root.updated_at || (updatesArray?.[updatesArray.length - 1]?.timestamp ?? null),
    carrier: root.carrier || order.carrier || null,
    eta: root.eta || order.eta || null,
    updates: Array.isArray(updatesArray) ? updatesArray.map(normalizeUpdate) : [],
    raw: json,
  };

  return normalized;
}

export async function fetchTracking(orderId) {
  if (!orderId) throw new Error("orderId is required");

  const endpoint = process.env.NEXT_PUBLIC_TRACKING_ENDPOINT || "cart/api/tracking/";

  const makeUrl = (base) => {
    if (base.includes("?")) return `${base}${base.endsWith("?") ? "" : "&"}order_id=${encodeURIComponent(orderId)}`;
    // ensure trailing slash
    const withSlash = base.endsWith("/") ? base : `${base}/`;
    return `${withSlash}${encodeURIComponent(orderId)}/`;
  };

  const candidates = [
    makeUrl(endpoint),
    // Fallbacks for common patterns
    makeUrl("cart/api/delivery/track/?"),
    makeUrl("cart/api/order/track/?"),
    makeUrl("cart/api/tracking/?"),
  ];

  let lastError = null;
  for (const path of candidates) {
    try {
      const res = await customFetch(path);
      const json = await res.json();
      const normalized = normalizeResponse(json);
      if (normalized && (normalized.orderId || normalized.updates?.length)) {
        return normalized;
      }
    } catch (err) {
      lastError = err;
      // try next
    }
  }
  // If all failed, throw last error or a friendly message
  const msg = lastError?.response?.data?.msg || lastError?.message || "Tracking not found";
  const error = new Error(msg);
  error.code = lastError?.response?.status || 404;
  throw error;
}

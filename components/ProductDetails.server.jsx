import ProductActions from "@/components/ProductActions.client";
import ProductImageCarousel from "@/components/ProductImageCarousel.client";

function Stars({ value = 0 }) {
  const rounded = Math.round(Number(value) || 0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={
            i < rounded
              ? "text-yellow-600"
              : "text-muted-foreground/40"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductDetails({ product }) {
  const avgRating = product?.ratings?.stats?.avg_rating ?? 0;
  const totalRatings = product?.ratings?.stats?.total_ratings ?? 0;

  return (
    <main className="mx-auto w-full px-4 py-8">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 px-4 auto-rows-max">
        {/* Images */}
        <div className="space-y-4">
          <ProductImageCarousel
            productName={product?.name}
            images={product?.images || []}
          />
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            {product?.brandName && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-primary/60" />
                <span className="font-bold text-foreground">
                  {product.brandName}
                </span>
              </div>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {product?.name}
            </h1>

            {product?.seriesName && (
              <h2 className="text-lg font-semibold text-orange-500">
                {product.seriesName} series
              </h2>
            )}

            <div className="flex items-center gap-3">
              <Stars value={avgRating} />
              <span className="text-sm text-muted-foreground">
                {Number(avgRating).toFixed(1)} ({totalRatings} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-1">
            {product?.old_price ? (
              <div className="text-sm line-through text-muted-foreground">
                Rs {Number(product.old_price).toLocaleString()}
              </div>
            ) : null}
            <div className="text-3xl font-extrabold text-foreground">
              Rs {Number(product?.price || 0).toLocaleString()}
            </div>
            {product?.stock != null && (
              <div className="text-sm text-muted-foreground">
                Stock: {product.stock}
              </div>
            )}
          </div>

          {/* Actions (client) */}
          <ProductActions product={product} />

          {/* Description */}
          {product?.description && (
            <section className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Product Details
              </h3>
              <div
                className="prose max-w-none text-sm text-foreground/90"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </section>
          )}
        </div>
      </div>

      {/* Specs */}
      {Array.isArray(product?.attributes) && product.attributes.length > 0 && (
        <section className="mt-12 px-4">
          <h2 className="text-2xl font-bold mb-6">Product Specifications</h2>
          <div className="overflow-hidden rounded-lg shadow-modern border border-border">
            <table className="w-full bg-card">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-foreground uppercase tracking-wider">
                    Attribute
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-foreground uppercase tracking-wider">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(product.attributes || []).map((attr, index) =>
                  attr?.value ? (
                    <tr key={index} className="hover:bg-accent/50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm text-foreground font-medium">
                        {attr.attribute}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {attr.value}
                      </td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

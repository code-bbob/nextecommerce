import ProductTopSection from "@/components/ProductTopSection.client";
import RelatedProducts from "@/components/RelatedProducts.server";
import CompleteSetup from "@/components/CompleteSetup.server";
import Recommendations from "@/components/Recommendations.server";
import { Suspense } from "react";

export default function ProductDetails({ product }) {
  return (
    <main className="mx-auto w-full px-4 py-8">
      <ProductTopSection product={product} />

      {/* Recommendations - Between Description and Specifications */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <Suspense fallback={null}>
          <CompleteSetup productId={product.product_id} />
        </Suspense>
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

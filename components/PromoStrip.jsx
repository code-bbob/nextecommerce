import Link from "next/link";

export default function PromoStrip() {
  return (
    <div className="my-6 rounded-2xl border border-gray-200 bg-white p-4 flex flex-col md:flex-row items-center justify-between gap-3">
      <p className="text-sm md:text-base text-gray-700">
        Limited-time offers on bestsellers. Free express delivery and 0% EMI.
      </p>
      <div className="flex items-center gap-2">
        <Link href="/deals" className="rounded-full bg-black text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition">See Deals</Link>
        <a href="#featured" className="rounded-full border border-gray-300 bg-white text-gray-900 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition">What’s New</a>
      </div>
    </div>
  );
}

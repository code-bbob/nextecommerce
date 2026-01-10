"use client";
import { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, sendCartToServer } from "@/redux/cartSlice";
import { getLocalCart, setLocalCart } from "@/utils/localCart";
import { getCDNImageUrl } from "@/utils/imageUtils";
import {
  ShoppingCart,
  Flame,
  Clock,
  TrendingDown,
  Award,
  Sparkles,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useNavigationProgress } from "@/hooks/useNavigationProgress";
import BlackNavbar from "@/components/blackNavbar";
import CartSidebar from "@/components/cartSidebar";
import { toast } from "react-hot-toast";

const AuctionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  const [socialProof, setSocialProof] = useState({
    viewingNow: null,
    visitsToday: null,
  });
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef(null);
  const socialProofInitializedRef = useRef(false);
  const dispatch = useDispatch();
  useNavigationProgress();
  const isLoggedIn = useSelector((state) => state.access.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const getCurrentPrice = (product) => {
    if (!product) return 0;
    const price = prices[product.product_id];
    if (price !== undefined && price !== null && !Number.isNaN(Number(price))) {
      return Math.max(0, Math.floor(Number(price)));
    }
    return Math.max(0, Math.floor(Number(product.price) || 0));
  };

  const getDiscountPercent = (product, currentPrice) => {
    const original = Number(product?.price) || 0;
    if (!original || original <= 0) return 0;
    const pct = Math.round(((original - currentPrice) / original) * 100);
    return Number.isFinite(pct) && pct > 0 ? pct : 0;
  };

  const featuredProduct = useMemo(() => {
    if (!products?.length) return null;
    let best = null;
    let bestScore = -Infinity;
    for (const product of products) {
      const currentPrice = getCurrentPrice(product);
      const discountPct = getDiscountPercent(product, currentPrice);
      const saveAmount = Math.max(
        0,
        (Number(product.price) || 0) - currentPrice
      );
      const ended = timeLeft[product.product_id] === "ENDED";
      const score = (ended ? -1_000_000 : 0) + discountPct * 100 + saveAmount;
      if (score > bestScore) {
        best = product;
        bestScore = score;
      }
    }
    return best;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, prices, timeLeft]);

  useEffect(() => {
    const fetchAuctionProducts = async () => {
      try {
        const res = await fetch(`${backendBaseUrl}/shop/api/auction/`);
        const data = await res.json();
        const auctionItems = data.results || data;
        setProducts(auctionItems);
      } catch (error) {
        console.error("Failed to fetch auction products", error);
        toast.error("Failed to load auctions");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionProducts();
  }, [backendBaseUrl]);

  useEffect(() => {
    if (socialProofInitializedRef.current) return;
    if (loading) return;

    socialProofInitializedRef.current = true;

    // Fetch visit stats from the same endpoint as VisitCounter
    const fetchVisitStats = async () => {
      try {
        const statsRes = await fetch(`${backendBaseUrl}/shop/api/visits/`, {
          method: "POST",
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setSocialProof({
            viewingNow:
              statsData.current_viewers || statsData.viewingNow || 450,
            visitsToday: statsData.visits || statsData.visitsToday || null,
          });
          return;
        }
      } catch (error) {
        console.error("Failed to fetch visit stats", error);
      }

      // Fallback: use session storage if API fails
      const storageKey = "auction_social_proof_v1";
      try {
        const raw = sessionStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            setSocialProof({
              viewingNow: Number(parsed.viewingNow) || null,
              visitsToday: Number(parsed.visitsToday) || null,
            });
            return;
          }
        }
      } catch {
        // ignore
      }

      // Last resort: show generic message
      setSocialProof({
        viewingNow: null,
        visitsToday: null,
      });
    };

    fetchVisitStats();
  }, [loading, backendBaseUrl]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPrices = {};
      const newTimeLeft = {};
      const now = new Date();

      products.forEach((p) => {
        if (!p.auction_start_time) return;
        const startTime = new Date(p.auction_start_time);
        const hoursElapsed = (now - startTime) / (1000 * 60 * 60);
        const decayRate = 50;
        const decayAmount = Math.floor(hoursElapsed * decayRate);
        let currentPrice = p.price - decayAmount;
        if (p.base_price && currentPrice < p.base_price) {
          currentPrice = p.base_price;
        }
        newPrices[p.product_id] = currentPrice;

        const auctionEnd = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);
        const timeLeftMs = auctionEnd - now;
        if (timeLeftMs > 0) {
          const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
          const minutes = Math.floor(
            (timeLeftMs % (1000 * 60 * 60)) / (1000 * 60)
          );
          newTimeLeft[p.product_id] = `${hours}h ${minutes}m`;
        } else {
          newTimeLeft[p.product_id] = "ENDED";
        }
      });
      setPrices(newPrices);
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [products]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const existingItems = cartItems.filter(
      (item) => item.product_id === product.product_id
    );
    const count = existingItems.length;

    let priceToUse;
    let isAuctionPrice = false;
    let message;

    if (count === 0) {
      priceToUse =
        prices[product.product_id] !== undefined
          ? Math.floor(prices[product.product_id])
          : product.price;
      isAuctionPrice = true;
      message = `Added to cart at auction price! Rs ${priceToUse.toLocaleString()}`;
      toast.success(message, {
        style: {
          background: "#ffffff",
          color: "#0f172a",
          border: "1px solid #fecaca",
        },
      });
    } else {
      priceToUse = product.price;
      message = `Adding additional unit at full price! Rs ${priceToUse.toLocaleString()}`;
      toast.success(message, {
        style: {
          background: "#ffffff",
          color: "#0f172a",
          border: "1px solid #fed7aa",
        },
      });
    }

    const cartItem = {
      product_id: product.product_id,
      price: priceToUse,
      image: getCDNImageUrl(product.images?.[0]?.image || product.main_image),
      name: product.name,
      quantity: 1,
      isAuctionPrice: isAuctionPrice,
    };

    dispatch(addToCart(cartItem));

    if (isLoggedIn) {
      dispatch(sendCartToServer(cartItem));
    } else {
      const localCart = getLocalCart();
      if (isAuctionPrice) {
        localCart.push(cartItem);
      } else {
        const existingIndex = localCart.findIndex(
          (item) =>
            item.product_id === product.product_id && !item.isAuctionPrice
        );
        if (existingIndex !== -1) {
          localCart[existingIndex].quantity += 1;
        } else {
          localCart.push(cartItem);
        }
      }
      setLocalCart(localCart);
    }

    setTimeout(() => setCartOpen(true), 300);
  };

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const cardWidth = 360 + 20; // card width + gap
    const scrollAmount = cardWidth * 1;

    if (direction === "left") {
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      setCarouselIndex((prev) => Math.max(0, prev - 1));
    } else {
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      const maxIndex = Math.max(0, products.length - 3);
      setCarouselIndex((prev) => Math.min(maxIndex, prev + 1));
    }
  };

  if (loading)
    return (
      <>
        <BlackNavbar cartOpen={cartOpen} setCartOpen={setCartOpen} />
        <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <div className="flex justify-center items-center min-h-screen bg-white">
          <div className="text-center">
            <div className="rounded-full h-14 w-14 border-4 border-slate-200 border-t-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-700 text-base font-medium">
              Loading auctions…
            </p>
            <p className="text-slate-500 text-sm mt-1">Fresh drops incoming.</p>
          </div>
        </div>
      </>
    );

  return (
    <>
      <BlackNavbar cartOpen={cartOpen} setCartOpen={setCartOpen} />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <div className="min-h-screen bg-white">
        {/* Subtle background accents */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-56 -right-40 h-96 w-96 rounded-full bg-indigo-100 blur-3xl" />
          <div className="absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-amber-100 blur-3xl" />
          <div className="absolute -bottom-56 right-1/3 h-96 w-96 rounded-full bg-emerald-100 blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Hero */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              <div className="lg:col-span-7">
                <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white/80 backdrop-blur px-4 py-2">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-700">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    Live price drops
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-700">
                    <TrendingDown className="h-4 w-4 text-emerald-600" />
                    50 Rs/hr
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-700">
                    <Clock className="h-4 w-4 text-amber-600" />
                    24h window
                  </span>
                </div>

                <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.02]">
                  Auction drops that feel illegal.
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-slate-900 to-emerald-600">
                    Grab before it climbs.
                  </span>
                </h1>

                <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Prices fall every hour. The first add-to-cart locks the
                  current auction price.
                  <span className="text-slate-900 font-semibold">
                    {" "}
                    Waiting is a gamble.
                  </span>
                </p>

                {/* Social proof / FOMO */}
                <div className="mt-7">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-xl bg-white border border-amber-200 p-2">
                        <Users className="h-5 w-5 text-amber-700" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {socialProof.visitsToday
                            ? `${socialProof.visitsToday.toLocaleString()} visits today`
                            : "Lots of shoppers here today"}
                        </p>
                        <p className="text-sm text-slate-600">
                          If it looks good now, it won't in an hour.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        Stock per Auction
                      </span>
                      <TrendingDown className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="mt-2 text-2xl font-black text-slate-900">
                      1
                    </p>
                    <p className="text-xs text-slate-500">Auto-updated</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        Price drop
                      </span>
                      <TrendingDown className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="mt-2 text-2xl font-black text-slate-900">
                      50 Rs/hr
                    </p>
                    <p className="text-xs text-slate-500">Auto-updated</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        Visitors Count
                      </span>
                      <TrendingDown className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="mt-2 text-2xl font-black text-slate-900">
                        {socialProof.visitsToday
                            ? `${socialProof.visitsToday.toLocaleString()}`:'N/A'}
                    </p>
                    <p className="text-xs text-slate-500">Auto-updated</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        Price drop
                      </span>
                      <TrendingDown className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="mt-2 text-2xl font-black text-slate-900">
                      50 Rs/hr
                    </p>
                    <p className="text-xs text-slate-500">Auto-updated</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        Auction window
                      </span>
                      <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="mt-2 text-2xl font-black text-slate-900">
                      24 Hours
                    </p>
                    <p className="text-xs text-slate-500">From start time</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        Live auctions
                      </span>
                      <Award className="h-4 w-4 text-indigo-600" />
                    </div>
                    <p className="mt-2 text-2xl font-black text-slate-900">
                      {products.length}
                    </p>
                    <p className="text-xs text-slate-500">Limited stock</p>
                  </div>
                </div>
              </div>

              {/* Featured hero card - Carousel */}
              <div className="lg:col-span-5">
                {products.length > 0 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {products.map((product) => {
                        const currentPrice = getCurrentPrice(product);
                        const discountPct = getDiscountPercent(
                          product,
                          currentPrice
                        );
                        const saveAmount = Math.max(
                          0,
                          (Number(product.price) || 0) - currentPrice
                        );
                        const isEnded =
                          timeLeft[product.product_id] === "ENDED";
                        return (
                          <CarouselItem key={product.product_id}>
                            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                              <div className="p-5 sm:p-6 border-b border-slate-100">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                      Featured drop
                                    </p>
                                    <Link
                                      href={`/product/${product.product_id}`}
                                    >
                                      <h2 className="mt-2 text-lg sm:text-xl font-black text-slate-900 line-clamp-2">
                                        {product.name}
                                      </h2>
                                    </Link>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    {discountPct > 0 && (
                                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                                        <TrendingDown className="h-4 w-4" />-
                                        {discountPct}%
                                      </div>
                                    )}
                                    <div
                                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                                        isEnded
                                          ? "bg-rose-50 border border-rose-200 text-rose-700"
                                          : "bg-amber-50 border border-amber-200 text-amber-800"
                                      }`}
                                    >
                                      <Clock className="h-4 w-4" />
                                      {isEnded
                                        ? "Ended"
                                        : timeLeft[product.product_id] ||
                                          "Live"}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <Link href={`/product/${product.product_id}`}>
                                <div className="relative h-72 sm:h-80 bg-slate-50">
                                  <Image
                                    src={getCDNImageUrl(
                                      product.images?.[0]?.image ||
                                        product.main_image
                                    )}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-10"
                                  />
                                </div>
                              </Link>

                              <div className="p-5 sm:p-6">
                                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Current price
                                  </p>
                                  <div className="mt-2 flex items-end justify-between gap-3">
                                    <p className="text-3xl sm:text-4xl font-black text-slate-900">
                                      Rs {currentPrice.toLocaleString()}
                                    </p>
                                    <div className="text-right">
                                      <p className="text-sm text-slate-500 line-through">
                                        Rs{" "}
                                        {Number(
                                          product.price || 0
                                        ).toLocaleString()}
                                      </p>
                                      <p className="text-xs font-semibold text-emerald-700">
                                        Save Rs {saveAmount.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-3">
                                  <p className="text-xs font-bold text-rose-700">
                                    ⚠️ Only 1 in stock
                                  </p>
                                  <p className="text-xs text-rose-600 mt-1">
                                    This auction item is limited. Act fast!
                                  </p>
                                </div>

                                <Button
                                  onClick={(e) => handleAddToCart(e, product)}
                                  disabled={isEnded}
                                  className="mt-4 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-slate-900 text-white font-bold py-6"
                                >
                                  <ShoppingCart className="mr-2 h-5 w-5" />
                                  {isEnded
                                    ? "Auction ended"
                                    : "Add at current auction price"}
                                </Button>

                                <p className="mt-3 text-xs text-slate-500">
                                  First add uses the auction price; additional
                                  units use full price.
                                </p>
                              </div>
                            </div>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex -left-12" />
                    <CarouselNext className="hidden sm:flex -right-12" />
                  </Carousel>
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-600">
                    <p className="font-semibold">No featured drop yet</p>
                    <p className="text-sm mt-1">
                      Auctions will appear here when live.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Listings */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-14">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Live drops
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Prices update automatically. Grab early.
                </p>
              </div>
            </div>

            <div className="mt-6 relative">
              {products.length > 0 ? (
                <>
                  {/* Carousel Container */}
                  <div
                    ref={carouselRef}
                    className="overflow-x-auto scrollbar-hide scroll-smooth"
                    style={{ scrollBehavior: "smooth" }}
                  >
                    <div className="flex gap-6 pb-4">
                      {products.map((product) => {
                        const currentPrice = getCurrentPrice(product);
                        const discount = getDiscountPercent(
                          product,
                          currentPrice
                        );
                        const isEnded =
                          timeLeft[product.product_id] === "ENDED";
                        const saveAmount = Math.max(
                          0,
                          (Number(product.price) || 0) - currentPrice
                        );

                        return (
                          <div
                            key={product.product_id}
                            className="group flex-shrink-0 w-full md:w-96 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:border-slate-300 transition-all"
                          >
                            {/* Badges */}
                            <div className="p-4 pb-0">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  {discount > 0 && (
                                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                                      <TrendingDown className="h-4 w-4" />-
                                      {discount}%
                                    </div>
                                  )}
                                  <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700">
                                    <Flame className="h-4 w-4" />
                                    Dropping
                                  </div>
                                </div>
                                <div
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                                    isEnded
                                      ? "bg-rose-50 border border-rose-200 text-rose-700"
                                      : "bg-amber-50 border border-amber-200 text-amber-800"
                                  }`}
                                >
                                  <Clock className="h-4 w-4" />
                                  {isEnded
                                    ? "Ended"
                                    : timeLeft[product.product_id] || "Live"}
                                </div>
                              </div>
                            </div>

                            {/* Image */}
                            <Link href={`/product/${product.product_id}`}>
                              <div className="relative h-72 bg-slate-50 mt-4">
                                <Image
                                  src={getCDNImageUrl(
                                    product.images?.[0]?.image ||
                                      product.main_image
                                  )}
                                  alt={product.name}
                                  fill
                                  className="object-contain p-10"
                                />
                              </div>
                            </Link>

                            {/* Content */}
                            <div className="p-5">
                              <Link href={`/product/${product.product_id}`}>
                                <h3 className="text-base font-black text-slate-900 line-clamp-2 min-h-12 group-hover:underline">
                                  {product.name}
                                </h3>
                              </Link>

                              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                  Current price
                                </p>
                                <div className="mt-2 flex items-end justify-between gap-3">
                                  <p className="text-2xl font-black text-slate-900">
                                    Rs {currentPrice.toLocaleString()}
                                  </p>
                                  <div className="text-right">
                                    <p className="text-sm text-slate-500 line-through">
                                      Rs{" "}
                                      {Number(
                                        product.price || 0
                                      ).toLocaleString()}
                                    </p>
                                    <p className="text-xs font-semibold text-emerald-700">
                                      Save Rs {saveAmount.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-2 inline-block rounded-lg bg-rose-50 border border-rose-200 px-2 py-1">
                                <p className="text-xs font-bold text-rose-700">
                                  Only 1 left
                                </p>
                              </div>

                              <Button
                                onClick={(e) => handleAddToCart(e, product)}
                                disabled={isEnded}
                                className="mt-3 w-full rounded-2xl bg-slate-900 text-white font-bold py-6 hover:bg-slate-800"
                              >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {isEnded ? "Auction ended" : "Add to cart"}
                              </Button>

                              <p className="mt-3 text-xs text-slate-500">
                                First add uses auction price.
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  {products.length > 3 && (
                    <>
                      <button
                        onClick={() => scrollCarousel("left")}
                        disabled={carouselIndex === 0}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 z-20 rounded-full border border-slate-200 bg-white p-3 shadow-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="h-6 w-6 text-slate-900" />
                      </button>
                      <button
                        onClick={() => scrollCarousel("right")}
                        disabled={
                          carouselIndex >= Math.max(0, products.length - 3)
                        }
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 z-20 rounded-full border border-slate-200 bg-white p-3 shadow-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="h-6 w-6 text-slate-900" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-24">
                  <div className="mx-auto mb-5 h-14 w-14 rounded-2xl border border-slate-200 bg-white grid place-items-center">
                    <Flame className="h-7 w-7 text-slate-800" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">
                    No active auctions
                  </p>
                  <p className="mt-2 text-slate-600">
                    Premium drops are coming soon. Check back shortly.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionPage;

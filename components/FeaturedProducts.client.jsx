"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";

// Helper function to calculate discounted price
function getDiscountedPrice(price, discount) {
  const discounted = price - price * (discount / 100);
  return discounted.toFixed(2);
}

const products = [
  {
    id: 1,
    name: "AI Smart Assistant",
    img: "/images/gpu.jpg",
    price: 199,
    discount: 25,
  },
  {
    id: 2,
    name: "Track TK Mechanical Keyboard Set",
    img: "/images/track.jpg",
    small_img: "/images/track_small.jpg",
    price: 5000,
    discount: 30,
  },
  {
    id: 3,
    name: "VR Metaverse Bundle",
    img: "/images/atom_keyboard.png",
    price: 299,
    discount: 20,
  },
];

export default function FeaturedProducts() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    // Initial check
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Featured Products
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our handpicked selection of premium tech products
        </p>
      </div>

      {/* Modern product showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hero Product - Takes up more space */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="lg:col-span-7"
        >
          <Card className="relative group bg-gradient-to-br from-card/80 to-muted/20 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 h-full">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative p-8 h-full flex flex-col">
              {/* Badge */}
              <div className="absolute top-6 right-6 bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                🌟 Editor's Choice
              </div>

              <div className="flex-1 flex flex-col lg:flex-row items-center gap-8">
                {/* Product Image */}
                <div className="relative w-full lg:w-1/2 h-64 lg:h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-muted/30 rounded-2xl"></div>
                  <Image
                    src={products[0].img}
                    alt={products[0].name}
                    fill
                    className="object-contain drop-shadow-2xl p-4"
                    priority
                  />
                  {/* Floating price tag */}
                  <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-2xl px-4 py-2">
                    <div className="text-sm text-muted-foreground line-through">
                      RS. {products[0].price}
                    </div>
                    <div className="text-lg font-bold text-primary">
                      RS. {getDiscountedPrice(products[0].price, products[0].discount)}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      {products[0].name}
                    </h3>
                    <p className="text-muted-foreground">
                      Revolutionary AI-powered assistant that transforms your workflow
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {["Advanced AI Processing", "Voice Recognition", "Smart Integration"].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl py-6">
                      Quick View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Side Products */}
        <div className="lg:col-span-5 space-y-6">
          {products.slice(1).map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.2, duration: 0.6 }}
            >
              <Link href={index === 0 ? "/product/track-tk-586-apollo-in-nepal" : "#"}>
                <Card className="group bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/50 rounded-xl"></div>
                        <Image
                          src={isSmallScreen && product.small_img ? product.small_img : product.img}
                          alt={product.name}
                          fill
                          className="object-contain p-2"
                          priority
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 space-y-2">
                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                          {product.name}
                        </h4>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground line-through">
                            RS. {product.price}
                          </span>
                          <span className="font-bold text-primary">
                            RS. {getDiscountedPrice(product.price, product.discount)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                            ))}
                            <span className="text-xs text-muted-foreground ml-1">4.8</span>
                          </div>
                          
                          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-4 py-2">
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
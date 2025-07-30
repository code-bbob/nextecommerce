"use client";
import { motion } from "framer-motion";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rubina S.",
      role: "Software Engineer",
      content: "I couldn't believe the prices – the quality is incredible. I've never shopped anywhere else!",
      rating: 5,
      avatar: "👩‍💻"
    },
    {
      name: "Nabin K.",
      role: "Designer",
      content: "The best deals I've ever seen. Fast, reliable, and unbeatable value. Highly recommended!",
      rating: 5,
      avatar: "👨‍🎨"
    },
    {
      name: "Bikash T.",
      role: "Entrepreneur",
      content: "A game changer in digital shopping. I always find exactly what I need at the best price.",
      rating: 5,
      avatar: "👨‍💼"
    }
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl -z-10"></div>
      <div className="absolute top-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-[80px] -z-10"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/10 rounded-full blur-[80px] -z-10"></div>

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          What Our Customers Say
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Don't just take our word for it - hear from our satisfied customers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
            className="group"
          >
            <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
              {/* Quote icon */}
              <div className="text-4xl text-primary/20 mb-4">"</div>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <div key={i} className="w-4 h-4 text-primary">⭐</div>
                ))}
              </div>

              {/* Testimonial content */}
              <p className="text-muted-foreground text-lg italic mb-6 leading-relaxed">
                {testimonial.content}
              </p>

              {/* Customer info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats section */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { number: "10K+", label: "Happy Customers" },
          { number: "99%", label: "Satisfaction Rate" },
          { number: "24/7", label: "Support Available" },
          { number: "2 Year", label: "Warranty" }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {stat.number}
            </div>
            <div className="text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

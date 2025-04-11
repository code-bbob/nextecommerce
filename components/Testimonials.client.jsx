"use client";
import { motion } from "framer-motion";

export default function Testimonials() {
  return (
    <section className="mt-20 bg-gray-800 p-8 rounded-xl shadow-2xl">
      <h2 className="text-4xl font-bold text-center mb-8">
        Why Our Customers Love Us
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center"
        >
          <p className="text-xl italic">
            "I couldn't believe the prices – the quality is incredible.
            I've never shopped anywhere else!"
          </p>
          <p className="mt-4 font-bold">– Rubina S.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <p className="text-xl italic">
            "The best deals I've ever seen. Fast, reliable, and unbeatable value.
            Highly recommended!"
          </p>
          <p className="mt-4 font-bold">– Nabin K.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-center"
        >
          <p className="text-xl italic">
            "A game changer in digital shopping. I always find exactly what I need at the best price."
          </p>
          <p className="mt-4 font-bold">– Bikash T.</p>
        </motion.div>
      </div>
    </section>
  );
}

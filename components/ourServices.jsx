"use client";
import { motion } from "framer-motion";

export default function OurServices() {
  return (
    <section className="mt-5 bg-gray-800 p-8 rounded-xl shadow-2xl">
      <h2 className="text-4xl font-bold text-center mb-8">
        Our Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center"
        >
          <p className="text-xl italic">
            Authentic and Warranty Laptops, Smartphones and Accessories at the best prices.
          </p>
          {/* <p className="mt-4 font-bold">– Alex M.</p> */}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <p className="text-xl italic">
            Quick and Best quality repairs and customer service with over 10 years of experience.
          </p>
          {/* <p className="mt-4 font-bold">– Jamie L.</p> */}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-center"
        >
          <p className="text-xl italic">
            Easy and Free Returns on goods purchased from us. We value your satisfaction.
          </p>
          {/* <p className="mt-4 font-bold">– Morgan S.</p> */}
        </motion.div>
      </div>
    </section>
  );
}

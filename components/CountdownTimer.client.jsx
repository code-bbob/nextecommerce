"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CountdownTimer() {
  const calculateTimeLeft = () => {
    const difference = +new Date("2025-04-30T23:59:59") - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Minutes: Math.floor((difference / 1000 / 60) % 60),
        Seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const timerComponents = [];
  Object.keys(timeLeft).forEach((interval) => {
    timerComponents.push(
      <div key={interval} className="bg-white/70 backdrop-blur-sm border border-gray-200/70 rounded-2xl p-6 min-w-[100px] text-center">
        <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
          {timeLeft[interval]}
        </div>
        <div className="text-sm text-gray-600 uppercase tracking-wider">
          {interval}
        </div>
      </div>
    );
  });

  return (
    <section className="relative my-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-transparent to-purple-50/50 rounded-3xl -z-10"></div>
      <div className="absolute top-4 left-4 w-32 h-32 bg-indigo-200/20 rounded-full blur-[60px] -z-10"></div>
      <div className="absolute bottom-4 right-4 w-32 h-32 bg-purple-200/20 rounded-full blur-[60px] -z-10"></div>
      
      <div className="bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 text-center shadow-xl">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">🔥 Flash Sale Alert!</h2>
          <p className="text-lg text-gray-600">
            Exclusive deals ending soon. Don't miss out!
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {timerComponents.length ? timerComponents : (
            <div className="text-2xl font-bold text-indigo-600">🎉 Offer Expired!</div>
          )}
        </div>

        {timeLeft && Object.keys(timeLeft).length > 0 && (
          <div className="flex justify-center">
            <Link href="/deals" className="inline-block">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                Shop Now • Save Up to 50%
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

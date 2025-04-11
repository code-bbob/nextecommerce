"use client";
import { useState, useEffect } from "react";

export default function CountdownTimer() {
  const calculateTimeLeft = () => {
    const difference = +new Date("2025-04-14T23:59:59") - +new Date();
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
      <span key={interval} className="mx-1">
        {timeLeft[interval]} {interval}
      </span>
    );
  });

  return (
    <section className="bg-gray-800 rounded-xl p-6 mt-16 mb-12 text-center shadow-xl">
      <h2 className="text-3xl font-bold mb-4">Limited Time Offer!</h2>
      <p className="text-xl text-gray-300 mb-4">
        Grab these deals before they vanish.
      </p>
      <div className="text-2xl font-mono text-yellow-400">
        {timerComponents.length ? timerComponents : <span>Offer Expired!</span>}
      </div>
    </section>
  );
}

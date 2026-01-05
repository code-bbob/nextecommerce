'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CarouselWrapper({ children, productCount }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        ref.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [productCount]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      {/* Left Navigation Button */}
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg border transition-all ${
          canScrollLeft
            ? 'border-gray-300 hover:bg-gray-100 text-gray-700 opacity-0 group-hover:opacity-100'
            : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-0'
        }`}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right Navigation Button */}
      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg border transition-all ${
          canScrollRight
            ? 'border-gray-300 hover:bg-gray-100 text-gray-700 opacity-0 group-hover:opacity-100'
            : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-0'
        }`}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );
}

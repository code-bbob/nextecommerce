"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getCDNImageUrl } from "@/utils/imageUtils";

export default function ProductImageCarousel({ productName, images }) {
  const carouselApi = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStartIndex, setModalStartIndex] = useState(0);

  const allImages = useMemo(() => {
    if (!Array.isArray(images)) return [];
    return images
      .map((img) => getCDNImageUrl(img?.image))
      .filter(Boolean);
  }, [images]);

  const openModalAt = useCallback((index) => {
    const safeIndex = Math.max(0, Math.min(index, Math.max(0, allImages.length - 1)));
    setModalStartIndex(safeIndex);
    setModalOpen(true);
  }, [allImages.length]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, closeModal]);

  const handleThumbClick = useCallback((clickedImage) => {
    const clickedIndex = allImages.indexOf(clickedImage);
    if (clickedIndex !== -1 && carouselApi.current) {
      carouselApi.current.scrollTo(clickedIndex);
      setCurrentImageIndex(clickedIndex);
    }
  }, [allImages]);

  if (!allImages.length) {
    return (
      <div className="relative w-full aspect-square bg-card/50 border border-border rounded-xl overflow-hidden">
        <Image
          src="/placeholder.svg"
          alt={productName || "Product image"}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    );
  }

  return (
    <>
      <Carousel
        className="w-full rounded-lg overflow-hidden bg-card/30"
        setApi={(api) => {
          carouselApi.current = api;
          if (api) {
            api.on("select", () => {
              setCurrentImageIndex(api.selectedIndex);
            });
          }
        }}
        onMouseDown={() => setIsDragging(false)}
        onMouseMove={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(false)}
        onTouchMove={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
      >
        <CarouselContent className="h-60 md:h-[70vh]">
          {allImages.map((img, idx) => (
            <CarouselItem key={img + idx} className="flex items-center justify-center">
              <div
                className="relative w-full h-full cursor-pointer"
                onClick={() => {
                  if (!isDragging) openModalAt(idx);
                }}
              >
                <Image
                  src={img}
                  alt={`${productName || "Product"} - ${idx + 1}`}
                  fill
                  className="object-contain p-4 pointer-events-none"
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {allImages.length > 1 && (
          <>
            <CarouselPrevious className="left-4 bg-black/50 hover:bg-black/70 text-white border-0 h-10 w-10" />
            <CarouselNext className="right-4 bg-black/50 hover:bg-black/70 text-white border-0 h-10 w-10" />
          </>
        )}
      </Carousel>

      <div className="grid grid-cols-4 gap-2 mt-3">
        {(images || [])
          .filter((img) => img && img.image)
          .slice(0, 12)
          .map((img, i) => {
            const url = getCDNImageUrl(img.image);
            if (!url) return null;
            return (
              <div
                key={url + i}
                className={`relative aspect-square overflow-hidden border ${
                  allImages[currentImageIndex] === url
                    ? "border-primary shadow-md"
                    : "border-border"
                } bg-card/50 backdrop-blur-sm hover:scale-105 cursor-pointer transition-all duration-200 hover:shadow-md rounded-lg`}
                onClick={() => handleThumbClick(url)}
              >
                <Image
                  src={url}
                  alt={`${productName || "Product"} - Thumbnail ${i + 1}`}
                  fill
                  className="object-contain p-2"
                  loading={i < 4 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 25vw, 12vw"
                />
              </div>
            );
          })}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white bg-black/40 hover:bg-black/60 border border-white/20 rounded-full h-10 w-10 flex items-center justify-center"
              aria-label="Close"
            >
              ×
            </button>

            <Carousel className="w-full" opts={{ loop: true, startIndex: modalStartIndex }}>
              <CarouselContent>
                {allImages.map((img, idx) => (
                  <CarouselItem key={`modal-${img}-${idx}`} className="flex items-center justify-center">
                    <div className="relative w-full aspect-square md:aspect-auto md:h-[80vh] flex items-center justify-center">
                      <Image
                        src={img}
                        alt={`${productName || "Product"} - Image ${idx + 1}`}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, 80vw"
                        priority={idx === modalStartIndex}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {allImages.length > 1 && (
                <>
                  <CarouselPrevious className="left-4 bg-black/50 hover:bg-black/70 text-white border-0 h-12 w-12" />
                  <CarouselNext className="right-4 bg-black/50 hover:bg-black/70 text-white border-0 h-12 w-12" />
                </>
              )}
            </Carousel>
          </div>
        </div>
      )}
    </>
  );
}

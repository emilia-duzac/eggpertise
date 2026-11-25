"use client";

import * as React from "react";
import Image from "@/components/optimized-image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alt?: string;
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
  alt = "Image",
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onOpenChange(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, images.length]);

  if (images.length === 0) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-[110] p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* Image container */}
          <div className="relative w-[90vw] h-[90vh]">
            <Image
              src={images[currentIndex]}
              alt={`${alt} - ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm z-[110]">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

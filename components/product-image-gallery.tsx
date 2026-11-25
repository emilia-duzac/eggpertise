"use client";

import * as React from "react";
import Image from "@/components/optimized-image";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { cn } from "@/lib/utils";

type CarouselApi = ReturnType<() => any>;

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const handleThumbnailClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="space-y-3">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <div className="relative">
            <CarouselContent className="-ml-2">
              {images.map((imagen, index) => (
                <CarouselItem key={index} className="pl-2 basis-full">
                  <Card className="bg-white border border-border/50 group overflow-hidden p-0 rounded-xl">
                    <div
                      className="relative overflow-hidden cursor-zoom-in"
                      onClick={() => handleImageClick(index)}
                    >
                      <Image
                        src={imagen}
                        alt={`${productName} - Imagen ${index + 1}`}
                        width={800}
                        height={600}
                        style={{ width: "100%", height: "auto" }}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white border-black/10 text-foreground h-9 w-9 z-10 shadow-md" />
                <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white border-black/10 text-foreground h-9 w-9 z-10 shadow-md" />
              </>
            )}
          </div>
        </Carousel>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="hidden sm:flex gap-2 justify-center px-1">
            {images.map((imagen, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0",
                  currentSlide === index
                    ? "border-primary ring-2 ring-primary/20 scale-105"
                    : "border-transparent opacity-60 hover:opacity-100 hover:border-border"
                )}
              >
                <Image
                  src={imagen}
                  alt={`${productName} - Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <ImageLightbox
        images={images}
        initialIndex={selectedIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        alt={productName}
      />
    </>
  );
}

"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/gtm";

interface ProductViewTrackerProps {
  slug: string;
  nombre: string;
  marca?: string;
}

// Announces that a product page was opened. Renders nothing.
export function ProductViewTracker({ slug, nombre, marca }: ProductViewTrackerProps) {
  useEffect(() => {
    trackEvent({
      event: "view_item",
      ecommerce: {
        items: [{ item_id: slug, item_name: nombre, item_brand: marca }],
      },
    });
  }, [slug, nombre, marca]);

  return null;
}

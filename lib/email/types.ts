import type { Seal } from "./layout";

/** What a sendable email needs: the pieces `sendEmail` takes. */
export interface EmailMessage {
  subject: string;
  html: string;
  text: string;
  /** Where a reply goes. Omitted when the sender address is the right one. */
  replyTo?: string | string[];
}

export interface ProductContext {
  name: string;
  /** Own line (Compostaje) or any other. Decides the seal. */
  line?: "compostaje" | "other";
  /** Supplier of the product, for the seal. Missing: no seal. */
  supplier?: { name: string; logoUrl: string };
}

export function sealFor(product: ProductContext): Seal | undefined {
  if (product.line === "compostaje") return { kind: "compostaje" };
  if (product.supplier) {
    return {
      kind: "supplier",
      name: product.supplier.name,
      logoUrl: product.supplier.logoUrl,
    };
  }
  return undefined;
}

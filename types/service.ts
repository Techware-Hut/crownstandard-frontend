// @/types/service.ts
// Centralized types + safe normalizers + tiny inline tests for the Service Detail page.
// These are designed to be framework-agnostic and importable from any Next.js route.

// --------------- Enums & Utility ---------------
export type ID = string & { readonly brand: unique symbol };

export type Option<T extends string | number = string> = {
  label: string;
  value: T;
};

export enum PriceUnit {
  PerHour = "hour",
  PerService = "service",
}

export enum BadgeType {
  Residential = "residential",
  Commercial = "commercial",
  Popular = "popular",
}

export enum UploadCategory {
  CommonAreas = "common_areas",
  Flooring = "flooring",
  Bathrooms = "bathrooms",
}

// --------------- Core Entities ---------------
export interface Provider {
  id: ID;
  name: string;
}

export interface Address {
  line1?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  // convenience single-line
  formatted?: string | null;
}

export interface ServicePricing {
  amount: number; // in INR or USD depending on your app; UI will label
  currency: string; // "INR" | "USD" | etc.
  unit: PriceUnit; // hour or per-service
  minHours?: number | null; // e.g., 2h minimum
}

export interface Service {
  id: ID;
  name: string;
  category: string;
  badge?: BadgeType | null; // e.g., Residential
  rating: number; // 0–5
  reviewCount: number;
  pricing: ServicePricing;
  durationMins?: number | null; // optional total duration for fixed packages
  location?: string | null; // city string for the overview pills
  coverImageUrl?: string | null;
  gallery?: string[] | null;
  shortDescription: string; // small paragraph under title
  longNotice?: string | null; // "Service Notice" box
  disclaimer?: string | null; // important disclaimer box
  provider?: Provider | null;
  providerApprovalStatus?: string | null;
  highlights: string[]; // bullet list
  whatsIncluded?: string[] | null;
  whatsExcluded?: string[] | null;
  faqs?: { q: string; a: string }[] | null;
}

// --------------- Booking Form Models ---------------
export interface DiscountBreakdown {
  basePrice: number; // computed base
  subtotal: number;
  total: number;
  currency: string; // keep to match pricing.currency
}

export interface BookingFormValues {
  preferredDate?: string | null; // ISO date
  preferredTime?: string | null; // HH:mm
  durationHours?: number | null; // user-chosen hours
  serviceAddress?: Address | null;
  specialInstructions?: string | null;
  discountCode?: string | null;
  // Property info
  squareFootage?: number | null;
  entryMethod?: Option["value"] | null; // e.g., "doorman", "lockbox", etc.
  entryInstructions?: string | null;
  additionalNotes?: string | null;
  // Photo uploads – in real app these would be files/URLs
  photos?: Partial<Record<UploadCategory, string[]>> | null;
}

// --------------- Normalized Shapes ---------------
export type NormalizedService = Omit<
  Service,
  | "gallery"
  | "whatsIncluded"
  | "whatsExcluded"
  | "faqs"
  | "coverImageUrl"
  | "location"
  | "durationMins"
  | "badge"
  | "provider"
> & {
  gallery: string[];
  whatsIncluded: string[];
  whatsExcluded: string[];
  faqs: { q: string; a: string }[];
  coverImageUrl: string; // guaranteed non-empty
  location: string | null;
  durationMins: number | null;
  badge: BadgeType | null;
  provider: Provider | null;
};

const FALLBACK_IMG_DATA_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 630'>` +
      `<defs><linearGradient id='g' x1='0' x2='1'><stop stop-color='#f8fafc'/><stop offset='1' stop-color='#e2e8f0'/></linearGradient></defs>` +
      `<rect fill='url(#g)' width='1200' height='630'/>` +
      `<g fill='#0f172a' font-family='system-ui,Segoe UI,Roboto,Helvetica,Arial' text-anchor='middle'>` +
      `<text x='600' y='320' font-size='40' font-weight='600'>Service image</text>` +
      `</g>` +
    `</svg>`
  );

export function normalizeService(service: Service): NormalizedService {
  return {
    ...service,
    coverImageUrl: service.coverImageUrl?.trim() || FALLBACK_IMG_DATA_URI,
    gallery: Array.isArray(service.gallery) ? service.gallery.filter(Boolean) : [],
    whatsIncluded: Array.isArray(service.whatsIncluded) ? service.whatsIncluded.filter(Boolean) : [],
    whatsExcluded: Array.isArray(service.whatsExcluded) ? service.whatsExcluded.filter(Boolean) : [],
    faqs: Array.isArray(service.faqs) ? service.faqs : [],
    location: service.location?.trim() || null,
    durationMins:
      typeof service.durationMins === "number" && Number.isFinite(service.durationMins)
        ? service.durationMins
        : null,
    badge: service.badge ?? null,
    provider: service.provider ?? null,
  };
}

// --------------- Formatters ---------------
export function clampRating(r: number): number {
  if (!Number.isFinite(r)) return 0;
  return Math.max(0, Math.min(5, r));
}

export function formatMoney(n: number | null | undefined, currency: string): string {
  const amt = typeof n === "number" && Number.isFinite(n) ? n : 0;
  // You can switch locale based on currency later
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amt);
}

export function formatPriceUnit(unit: PriceUnit): string {
  return unit === PriceUnit.PerHour ? "/hour" : "/service";
}

export function formatDuration(mins: number | null | undefined): string | null {
  if (typeof mins !== "number" || !Number.isFinite(mins) || mins <= 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h} hr ${m} min`;
  if (h) return `${h} hr`;
  return `${m} min`;
}

// --------------- Dummy Data (for now) ---------------
export const DUMMY_SERVICE: Service = {
  id: "svc_001" as ID,
  name: "Deluxe Apartment Cleaning test",
  category: "Home Services",
  badge: BadgeType.Residential,
  rating: 4.8,
  reviewCount: 312,
  pricing: { amount: 30, currency: "USD", unit: PriceUnit.PerHour, minHours: 2 },
  durationMins: 120,
  location: "New York, NY",
  coverImageUrl: "/serviceDetailPage.jpg",
  gallery: ["/serviceDetailPage.jpg"],
  shortDescription:
    "Thorough cleaning for apartments, including kitchen, bathroom, and living areas. Perfect for regular maintenance or move-out prep.",
  longNotice:
    "Service Notice: The Basic Cleaning Service includes general cleaning of floors, windows, bathrooms, kitchen surfaces, and household garbage in a standard home. This hourly rate reflects routine maintenance cleaning only.",
  disclaimer:
    "Important Disclaimer: We are not responsible for any damaged, lost, or stolen property during the cleaning service. All service providers are independent contractors responsible for obtaining and maintaining their own liability insurance coverage.",
  provider: { id: "prov_001" as ID, name: "Service Provider" },
  highlights: [
    "Deep cleaning of kitchen & bathrooms",
    "Dusting, vacuuming, and mopping",
    "Window & balcony cleaning",
    "Trash removal",
  ],
  whatsIncluded: ["All cleaning supplies", "2–3 crew members", "Up to 2 hours of service (extendable)"],
  whatsExcluded: ["Wall repainting", "Pest control", "Fixing structural damages"],
  faqs: [
    { q: "Do I need to be at home during the service?", a: "Not necessary, but recommended for the first visit to align on preferences." },
    { q: "How is pricing calculated?", a: "Base price covers up to 2 hours; add-ons and extra time are billed additionally." },
  ],
};

// --------------- Inline Tests (NODE_ENV === 'test') ---------------
if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
  const assert = (cond: unknown, msg: string) => {
    if (!cond) throw new Error(msg);
  };

  const s = normalizeService({ ...DUMMY_SERVICE, coverImageUrl: "", gallery: null, whatsIncluded: undefined, durationMins: null });
  assert(s.coverImageUrl.length > 0, "coverImageUrl gets a fallback");
  assert(Array.isArray(s.gallery) && s.gallery.length === 0, "gallery defaults to []");
  assert(s.durationMins === null, "durationMins remains null when not provided");

  // Formatters
  assert(clampRating(6) === 5, "rating capped at 5");
  assert(formatDuration(75) === "1 hr 15 min", "formatDuration 75");
  assert(formatMoney(60, "USD").startsWith("$"), "formatMoney USD symbol");
}

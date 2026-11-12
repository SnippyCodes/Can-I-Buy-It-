/*
 * Static stand-in for the Channel3 search API used in the repo's
 * app/storefront/page.tsx. Shapes stay close to Channel3's Product/Offer
 * so the components can be pointed at /api/channel3/* later.
 */

export type CategoryId = "all" | "sneakers" | "audio" | "cameras" | "laptops" | "watches";

export const categories: { id: CategoryId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sneakers", label: "Sneakers" },
  { id: "audio", label: "Audio" },
  { id: "cameras", label: "Cameras" },
  { id: "laptops", label: "Laptops" },
  { id: "watches", label: "Watches" },
];

export interface Offer {
  merchant: string;
  domain: string;
  price: number;
  shipping: number;
  delivery: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: Exclude<CategoryId, "all">;
  image: string;
  imageAlt: string;
  rating: number;
  reviews: number;
  description: string;
  attributes: [string, string][];
  variant: { name: string; options: string[] };
  offers: Offer[];
  /** Weekly lowest price over the last 90 days, oldest first. */
  priceHistory: number[];
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&h=1100&q=80`;

export const products: Product[] = [
  {
    id: "studio-anc-over-ear",
    title: "Studio ANC Over-Ear Headphones",
    brand: "Halden Audio",
    category: "audio",
    image: img("photo-1585298723682-7115561c51b7"),
    imageAlt: "Black over-ear headphones photographed in black and white",
    rating: 4.7,
    reviews: 2184,
    description:
      "Closed-back over-ears with adaptive noise cancelling, 40-hour battery and memory-foam cushions tuned for long sessions.",
    attributes: [
      ["Driver", "40 mm dynamic"],
      ["Battery", "40 hours, ANC on"],
      ["Connectivity", "Bluetooth 5.3, USB-C audio"],
      ["Weight", "254 g"],
    ],
    variant: { name: "Finish", options: ["Graphite", "Sand", "Midnight"] },
    offers: [
      { merchant: "Northline Electronics", domain: "northline.com", price: 350, shipping: 0, delivery: "Thu, 2 days", inStock: true },
      { merchant: "Sonic Supply", domain: "sonicsupply.co", price: 364, shipping: 0, delivery: "Fri, 3 days", inStock: true },
      { merchant: "Atlas Marketplace", domain: "atlas.shop", price: 339, shipping: 14.99, delivery: "Next week", inStock: true },
    ],
    priceHistory: [399, 399, 389, 389, 379, 379, 399, 369, 359, 359, 349, 355, 350],
  },
  {
    id: "court-low-leather",
    title: "Court Low Leather Sneaker",
    brand: "Field & Form",
    category: "sneakers",
    image: img("photo-1623788975845-7d3e0adbae7c"),
    imageAlt: "White leather low-top sneaker on a dark background",
    rating: 4.8,
    reviews: 9312,
    description:
      "Full-grain leather upper, stitched cupsole and a padded collar. An everyday white sneaker that holds its shape.",
    attributes: [
      ["Upper", "Full-grain leather"],
      ["Sole", "Stitched rubber cupsole"],
      ["Fit", "True to size"],
      ["Care", "Wipe clean"],
    ],
    variant: { name: "Size", options: ["8", "9", "10", "11", "12"] },
    offers: [
      { merchant: "Stride House", domain: "stridehouse.com", price: 115, shipping: 0, delivery: "Wed, 1 day", inStock: true },
      { merchant: "Atlas Marketplace", domain: "atlas.shop", price: 109, shipping: 8, delivery: "Fri, 3 days", inStock: true },
      { merchant: "Kickback Outlet", domain: "kickback.store", price: 124, shipping: 0, delivery: "Thu, 2 days", inStock: false },
    ],
    priceHistory: [120, 120, 120, 115, 115, 120, 120, 110, 110, 115, 115, 115, 115],
  },
  {
    id: "full-frame-mirrorless",
    title: "Full-Frame Mirrorless Camera Body",
    brand: "Kessler Optics",
    category: "cameras",
    image: img("photo-1516035069371-29a1b244cc32"),
    imageAlt: "Black mirrorless camera flat-lay on a black surface",
    rating: 4.9,
    reviews: 846,
    description:
      "33 MP back-illuminated sensor, 5-axis stabilisation and 4K60 10-bit video in a weather-sealed magnesium body.",
    attributes: [
      ["Sensor", "33 MP full-frame BSI"],
      ["Video", "4K60 10-bit 4:2:2"],
      ["Stabilisation", "5-axis, 5.5 stops"],
      ["Mount", "E-mount"],
    ],
    variant: { name: "Kit", options: ["Body only", "With 28–70 mm"] },
    offers: [
      { merchant: "Lens & Light", domain: "lensandlight.com", price: 1899, shipping: 0, delivery: "Thu, 2 days", inStock: true },
      { merchant: "Northline Electronics", domain: "northline.com", price: 1949, shipping: 0, delivery: "Wed, 1 day", inStock: true },
    ],
    priceHistory: [1999, 1999, 1999, 1949, 1949, 1899, 1899, 1949, 1949, 1899, 1899, 1899, 1899],
  },
  {
    id: "pro-14-laptop",
    title: "Pro 14\" Laptop, 18 GB / 1 TB",
    brand: "Arcadia",
    category: "laptops",
    image: img("photo-1525547719571-a2d4ac8945e2"),
    imageAlt: "Open laptop with a lit screen in a dark room",
    rating: 4.8,
    reviews: 3120,
    description:
      "14.2-inch mini-LED display, 12-core processor and 22-hour battery life in a 1.55 kg aluminium chassis.",
    attributes: [
      ["Display", "14.2\" mini-LED, 120 Hz"],
      ["Memory", "18 GB unified"],
      ["Storage", "1 TB SSD"],
      ["Battery", "Up to 22 hours"],
    ],
    variant: { name: "Colour", options: ["Space black", "Silver"] },
    offers: [
      { merchant: "Northline Electronics", domain: "northline.com", price: 1999, shipping: 0, delivery: "Thu, 2 days", inStock: true },
      { merchant: "Atlas Marketplace", domain: "atlas.shop", price: 1929, shipping: 0, delivery: "Next week", inStock: true },
      { merchant: "Campus Tech", domain: "campustech.edu.shop", price: 1849, shipping: 0, delivery: "Mon, 5 days", inStock: false },
    ],
    priceHistory: [1999, 1999, 1999, 1999, 1949, 1949, 1999, 1999, 1929, 1929, 1929, 1949, 1929],
  },
  {
    id: "sport-watch-45",
    title: "Sport Smartwatch 45 mm",
    brand: "Tempo",
    category: "watches",
    image: img("photo-1608640758028-5774280253a0"),
    imageAlt: "Silver smartwatch with a white sport band",
    rating: 4.6,
    reviews: 5407,
    description:
      "Always-on display, dual-frequency GPS, ECG and 36-hour battery. Swim-proof to 50 m.",
    attributes: [
      ["Case", "45 mm aluminium"],
      ["Battery", "36 hours"],
      ["Sensors", "ECG, SpO2, temperature"],
      ["Water", "WR50"],
    ],
    variant: { name: "Band", options: ["S/M", "M/L"] },
    offers: [
      { merchant: "Tempo Store", domain: "tempo.com", price: 399, shipping: 0, delivery: "Thu, 2 days", inStock: true },
      { merchant: "Atlas Marketplace", domain: "atlas.shop", price: 379, shipping: 6, delivery: "Fri, 3 days", inStock: true },
    ],
    priceHistory: [429, 429, 429, 399, 399, 399, 419, 419, 399, 389, 389, 379, 379],
  },
  {
    id: "wireless-monitor",
    title: "Wireless Monitor Headphones",
    brand: "Halden Audio",
    category: "audio",
    image: img("photo-1600086827875-a63b01f1335c"),
    imageAlt: "Black headphones resting on a white table",
    rating: 4.5,
    reviews: 1290,
    description:
      "Neutral studio tuning with a low-latency wireless mode and fold-flat cups for travel.",
    attributes: [
      ["Driver", "45 mm"],
      ["Latency", "38 ms low-latency mode"],
      ["Battery", "50 hours"],
      ["Weight", "238 g"],
    ],
    variant: { name: "Finish", options: ["Black", "Stone"] },
    offers: [
      { merchant: "Sonic Supply", domain: "sonicsupply.co", price: 179, shipping: 0, delivery: "Thu, 2 days", inStock: true },
      { merchant: "Northline Electronics", domain: "northline.com", price: 189, shipping: 0, delivery: "Wed, 1 day", inStock: true },
    ],
    priceHistory: [199, 199, 199, 189, 189, 189, 179, 179, 189, 189, 179, 179, 179],
  },
  {
    id: "ultralight-13",
    title: "Ultralight 13\" Notebook",
    brand: "Arcadia",
    category: "laptops",
    image: img("photo-1531297484001-80022131f5a1"),
    imageAlt: "Grey and black laptop on a surface",
    rating: 4.6,
    reviews: 2011,
    description:
      "Fanless 13.6-inch notebook at 1.24 kg with an 18-hour battery and a 1080p webcam.",
    attributes: [
      ["Display", "13.6\" Liquid Retina"],
      ["Memory", "16 GB"],
      ["Storage", "512 GB SSD"],
      ["Weight", "1.24 kg"],
    ],
    variant: { name: "Colour", options: ["Midnight", "Starlight", "Silver"] },
    offers: [
      { merchant: "Campus Tech", domain: "campustech.edu.shop", price: 1049, shipping: 0, delivery: "Fri, 3 days", inStock: true },
      { merchant: "Northline Electronics", domain: "northline.com", price: 1099, shipping: 0, delivery: "Wed, 1 day", inStock: true },
    ],
    priceHistory: [1199, 1199, 1149, 1149, 1149, 1099, 1099, 1099, 1149, 1099, 1049, 1049, 1049],
  },
  {
    id: "archive-paisley-low",
    title: "Archive Paisley Low-Top",
    brand: "Common Thread",
    category: "sneakers",
    image: img("photo-1789669105797-33bc5a281011"),
    imageAlt: "Low-top sneaker with plaid and paisley panels on black",
    rating: 4.4,
    reviews: 412,
    description:
      "Limited-run canvas low-top with mixed plaid and paisley panels, vulcanised sole and contrast stitching.",
    attributes: [
      ["Upper", "Printed cotton canvas"],
      ["Sole", "Vulcanised rubber"],
      ["Run", "Limited, 2,000 pairs"],
      ["Fit", "Runs half a size large"],
    ],
    variant: { name: "Size", options: ["7", "8", "9", "10", "11"] },
    offers: [
      { merchant: "Kickback Outlet", domain: "kickback.store", price: 92, shipping: 0, delivery: "Fri, 3 days", inStock: true },
      { merchant: "Stride House", domain: "stridehouse.com", price: 98, shipping: 0, delivery: "Thu, 2 days", inStock: true },
    ],
    priceHistory: [110, 110, 110, 110, 105, 105, 98, 98, 98, 95, 95, 92, 92],
  },
  {
    id: "rangefinder-compact",
    title: "Rangefinder Compact Camera",
    brand: "Kessler Optics",
    category: "cameras",
    image: img("photo-1535540878298-a155c6d065ef"),
    imageAlt: "Close-up of a camera lens and body",
    rating: 4.7,
    reviews: 633,
    description:
      "Fixed 35 mm f/2 lens, hybrid viewfinder and film-simulation profiles in a pocketable body.",
    attributes: [
      ["Sensor", "26 MP APS-C"],
      ["Lens", "23 mm f/2 (35 mm eq.)"],
      ["Viewfinder", "Hybrid optical / EVF"],
      ["Weight", "478 g"],
    ],
    variant: { name: "Finish", options: ["Black", "Silver"] },
    offers: [
      { merchant: "Lens & Light", domain: "lensandlight.com", price: 1399, shipping: 0, delivery: "Thu, 2 days", inStock: true },
      { merchant: "Atlas Marketplace", domain: "atlas.shop", price: 1449, shipping: 0, delivery: "Fri, 3 days", inStock: true },
    ],
    priceHistory: [1499, 1499, 1499, 1449, 1449, 1449, 1399, 1399, 1449, 1449, 1399, 1399, 1399],
  },
  {
    id: "closed-back-headset",
    title: "Closed-Back Gaming Headset",
    brand: "Volt Labs",
    category: "audio",
    image: img("photo-1655931546470-7b2e167b5fef"),
    imageAlt: "Headphones resting on a mechanical keyboard",
    rating: 4.3,
    reviews: 3876,
    description:
      "Detachable boom mic, 7.1 virtual surround and a steel headband with cooling gel pads.",
    attributes: [
      ["Driver", "50 mm"],
      ["Mic", "Detachable, cardioid"],
      ["Connection", "2.4 GHz + 3.5 mm"],
      ["Battery", "30 hours"],
    ],
    variant: { name: "Colour", options: ["Black", "White"] },
    offers: [
      { merchant: "Volt Labs", domain: "voltlabs.gg", price: 129, shipping: 0, delivery: "Thu, 2 days", inStock: true },
      { merchant: "Atlas Marketplace", domain: "atlas.shop", price: 119, shipping: 5, delivery: "Next week", inStock: true },
    ],
    priceHistory: [149, 149, 149, 139, 139, 129, 129, 129, 139, 129, 129, 129, 129],
  },
  {
    id: "everyday-trainer",
    title: "Everyday Canvas Trainer",
    brand: "Field & Form",
    category: "sneakers",
    image: img("photo-1672920800748-a5fb6dfd0c2b"),
    imageAlt: "White canvas sneakers worn on a black surface",
    rating: 4.5,
    reviews: 6230,
    description: "Lightweight organic-canvas trainer with a recycled rubber sole.",
    attributes: [
      ["Upper", "Organic canvas"],
      ["Sole", "40% recycled rubber"],
      ["Weight", "290 g per shoe"],
      ["Care", "Machine washable"],
    ],
    variant: { name: "Size", options: ["7", "8", "9", "10", "11", "12"] },
    offers: [
      { merchant: "Stride House", domain: "stridehouse.com", price: 68, shipping: 0, delivery: "Wed, 1 day", inStock: true },
      { merchant: "Kickback Outlet", domain: "kickback.store", price: 64, shipping: 6, delivery: "Fri, 3 days", inStock: true },
    ],
    priceHistory: [75, 75, 72, 72, 72, 70, 70, 68, 68, 68, 68, 68, 68],
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function offerTotal(o: Offer) {
  return Math.round((o.price + o.shipping) * 100) / 100;
}

/** Cheapest in-stock offer by landed cost; falls back to the first offer. */
export function bestOffer(p: Product): Offer {
  const inStock = p.offers.filter((o) => o.inStock);
  const pool = inStock.length ? inStock : p.offers;
  return pool.reduce((best, o) => (offerTotal(o) < offerTotal(best) ? o : best));
}

export const heroImage = {
  src: "https://images.unsplash.com/photo-1789520482092-bf7a66ef8281?auto=format&fit=crop&w=1400&q=80",
  alt: "Three pairs of low-top sneakers arranged on a dark surface",
};

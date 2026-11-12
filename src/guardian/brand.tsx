/*
 * Partner marks from the repo's public/logos/clean, with treatments tuned for
 * the Zinc canvas: AG Grid sits on a white tile, Render is inverted, Channel3
 * and the PayPal square are used as-is.
 */

export type Partner = "paypal" | "channel3" | "aggrid" | "render";

const PARTNERS: Record<Partner, { name: string; src: string; tile: string; img: string }> = {
  paypal: {
    name: "PayPal",
    src: "/logos/clean/paypal-square.png",
    tile: "overflow-hidden rounded-[22%]",
    img: "size-full object-cover",
  },
  channel3: {
    name: "Channel3",
    src: "/logos/clean/channel3.png",
    tile: "",
    img: "size-full object-contain",
  },
  aggrid: {
    name: "AG Grid",
    src: "/logos/clean/aggrid.png",
    tile: "rounded-[22%] bg-white",
    img: "h-[88%] w-[88%] object-contain",
  },
  render: {
    name: "Render",
    src: "/logos/clean/render.png",
    tile: "",
    img: "size-full object-contain invert",
  },
};

export const partnerName = (p: Partner) => PARTNERS[p].name;

export function PartnerMark({ partner, size = 28 }: { partner: Partner; size?: number }) {
  const p = PARTNERS[partner];
  return (
    <span className={`grid shrink-0 place-items-center ${p.tile}`} style={{ width: size, height: size }}>
      <img src={p.src} alt="" className={p.img} draggable={false} />
    </span>
  );
}

/** Icon + white wordmark, the lockup format used by the repo's landing hero. */
export function PartnerLockup({
  partner,
  size = 28,
  textClass = "text-[17px]",
}: {
  partner: Partner;
  size?: number;
  textClass?: string;
}) {
  return (
    <span className="flex items-center gap-2.5 select-none">
      <PartnerMark partner={partner} size={size} />
      <span className={`font-semibold tracking-[-0.02em] text-zinc-50 ${textClass}`}>{partnerName(partner)}</span>
    </span>
  );
}

/** Guardian shield cropped from the repo's guardian-logo.jpg. */
export function GuardianMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src="/logos/guardian-mark.jpg"
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={`shrink-0 rounded-[26%] ring-1 ring-white/10 ${className}`}
    />
  );
}

/** PayPal checkout button styling (gold #FFC439 with the PayPal wordmark). */
export const paypalButton =
  "inline-flex items-center justify-center gap-2 rounded-[9px] bg-[#ffc439] font-semibold text-[#003087] hover:brightness-[0.96] disabled:cursor-not-allowed disabled:opacity-40";

export function PayPalWordmark({ height = 18 }: { height?: number }) {
  return (
    <img
      src="/logos/clean/paypal.png"
      alt="PayPal"
      draggable={false}
      className="object-cover"
      style={{ height, width: height * 3.6, objectPosition: "center" }}
    />
  );
}

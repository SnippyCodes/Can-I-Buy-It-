import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/* Same 16px / 1.5 stroke grid as src/copilot/icons.tsx. */
function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ShieldIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 1.75 2.75 3.75v4c0 3.1 2.2 5.5 5.25 6.5 3.05-1 5.25-3.4 5.25-6.5v-4L8 1.75Z" />
    <path d="m5.75 8 1.6 1.6 2.9-3.1" />
  </Icon>
);
export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="7" cy="7" r="4.25" />
    <path d="m10.25 10.25 3.25 3.25" />
  </Icon>
);
export const BagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.25 5.25h9.5l-.7 8.25H3.95l-.7-8.25Z" />
    <path d="M5.75 5.25V4.5a2.25 2.25 0 0 1 4.5 0v.75" />
  </Icon>
);
export const SparkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 2v3M8 11v3M2 8h3M11 8h3M4.2 4.2l1.6 1.6M10.2 10.2l1.6 1.6M11.8 4.2l-1.6 1.6M5.8 10.2l-1.6 1.6" />
  </Icon>
);
export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </Icon>
);
export const ArrowLeftIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13 8H3M7 4 3 8l4 4" />
  </Icon>
);
export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m3.5 8.25 3 3 6-6.5" />
  </Icon>
);
export const WalletIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.25" y="4" width="11.5" height="9" rx="1.75" />
    <path d="M2.25 6.5h11.5M10.5 9.75h1" />
    <path d="M4 4V3.5a1 1 0 0 1 1.2-1l6 1" />
  </Icon>
);
export const StarIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m8 2.25 1.75 3.6 3.95.55-2.85 2.75.7 3.95L8 11.2l-3.55 1.9.7-3.95L2.3 6.4l3.95-.55L8 2.25Z" />
  </Icon>
);
export const StoreIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 6.25 3.5 2.75h9l1 3.5" />
    <path d="M2.5 6.25a1.85 1.85 0 0 0 3.7 0 1.85 1.85 0 0 0 3.6 0 1.85 1.85 0 0 0 3.7 0" />
    <path d="M3.5 8.5v4.75h9V8.5M6.75 13.25v-3h2.5v3" />
  </Icon>
);
export const LockIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.25" y="7" width="9.5" height="6.75" rx="1.5" />
    <path d="M5.25 7V5a2.75 2.75 0 0 1 5.5 0v2" />
  </Icon>
);
export const ClockIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="5.75" />
    <path d="M8 4.75V8l2.25 1.5" />
  </Icon>
);
export const TruckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M1.75 4h7.5v6.5h-7.5zM9.25 6.5h2.6l2.4 2.4v1.6h-5" />
    <circle cx="4.5" cy="11.75" r="1.25" />
    <circle cx="11.5" cy="11.75" r="1.25" />
  </Icon>
);
export const AlertIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 2.25 1.75 13.25h12.5L8 2.25Z" />
    <path d="M8 6.5v3M8 11.4v.1" />
  </Icon>
);
export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 6l4 4 4-4" />
  </Icon>
);
export const LayersIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 2 14 5.25 8 8.5 2 5.25 8 2Z" />
    <path d="m2 8.25 6 3.25 6-3.25M2 11l6 3.25L14 11" />
  </Icon>
);
export const ImageIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.25" y="2.75" width="11.5" height="10.5" rx="1.75" />
    <circle cx="5.75" cy="6.25" r="1.1" />
    <path d="m2.5 11.5 3.5-3.25 2.5 2.25 2-1.75 3 2.5" />
  </Icon>
);
export const ReceiptIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 1.75h9v12.5l-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1-1.5 1V1.75Z" />
    <path d="M5.75 5h4.5M5.75 7.75h4.5M5.75 10.5h2.5" />
  </Icon>
);
export const PauseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5.5 3.5v9M10.5 3.5v9" />
  </Icon>
);
export const PlayIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 3.25v9.5L12.5 8 5 3.25Z" />
  </Icon>
);
export const ReplayIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 8a5 5 0 1 0 1.5-3.55M3 2.75v2.5h2.5" />
  </Icon>
);
export const FilterIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 4h11M4.5 8h7M6.5 12h3" />
  </Icon>
);
export const GitHubIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

/* Brand mark: Guardian shield logo provided by user. */
export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <img
      src="/logos/guardian-mark.jpg"
      alt="Guardian"
      width={size}
      height={size}
      draggable={false}
      className="shrink-0 rounded-[26%] ring-1 ring-white/10 object-cover"
    />
  );
}

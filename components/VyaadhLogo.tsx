export function VyaadhLogo({ size = 120 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="120" height="120" rx="28" fill="#0D9488" />
      <path
        d="M30 78V42h14l16 24 16-24h14v36h-12V58l-14 20h-8l-14-20v20H30z"
        fill="white"
      />
      <circle cx="88" cy="36" r="8" fill="#F59E0B" />
    </svg>
  );
}

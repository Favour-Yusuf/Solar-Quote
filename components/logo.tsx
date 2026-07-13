import { cn } from "@/lib/utils";

export function Logo({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[28%] bg-primary",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 3v4M12 17v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M3 12h4M17 12h4M4.2 19.8l2.8-2.8M17 7l2.8-2.8"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3.5" fill="white" />
      </svg>
    </div>
  );
}

export function LogoMark({
  wordmarkClassName,
  className,
}: {
  wordmarkClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Logo size={32} />
      <span
        className={cn(
          "font-heading text-[17px] font-extrabold tracking-tight",
          wordmarkClassName
        )}
      >
        SolarQuote
      </span>
    </div>
  );
}

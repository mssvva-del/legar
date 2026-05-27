import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark";
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * LEGAR wordmark + yellow dot after R.
 * Завжди клікається у головну.
 */
export function Logo({
  variant = "light",
  showTagline = false,
  size = "md",
  className,
}: LogoProps) {
  const sizes = {
    sm: { word: "text-[20px]", tag: "text-[9px]" },
    md: { word: "text-[26px]", tag: "text-[10px]" },
    lg: { word: "text-[34px]", tag: "text-[12px]" },
  };

  return (
    <Link
      href={"/" as const}
      aria-label="LEGAR — на головну"
      className={cn(
        "group inline-flex flex-col leading-none focus-visible:outline-none",
        className,
      )}
    >
      <span
        className={cn(
          "font-[family-name:var(--font-manrope)] font-extrabold tracking-tight",
          sizes[size].word,
          variant === "dark" ? "text-white" : "text-[var(--color-ink)]",
        )}
      >
        LEGAR
        <span
          aria-hidden="true"
          className="ml-[2px] inline-block h-[8px] w-[8px] translate-y-[-2px] rounded-full bg-[var(--color-accent)] transition-transform group-hover:scale-125"
        />
      </span>
      {showTagline && (
        <span
          className={cn(
            "mt-1 font-[family-name:var(--font-inter)] font-medium uppercase tracking-[0.18em]",
            sizes[size].tag,
            variant === "dark" ? "text-white/60" : "text-[var(--color-ink)]/55",
          )}
        >
          Юридичний щит
        </span>
      )}
    </Link>
  );
}

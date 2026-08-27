"use client";

interface StaticHeroBackgroundProps {
  gradient?: [string, string];
  theme?: "dark" | "light";
}

export function StaticHeroBackground({
  gradient,
  theme = "dark",
}: StaticHeroBackgroundProps) {
  const darkBg = gradient
    ? `linear-gradient(180deg, ${gradient[0]}33 0%, #0B0F19 45%, #1a1f2e 100%)`
    : "linear-gradient(180deg, #0B0F19 0%, #1a1f2e 100%)";

  const lightBg = gradient
    ? `linear-gradient(180deg, ${gradient[0]}44 0%, #e8edf4 45%, #dbeafe 100%)`
    : "linear-gradient(180deg, #e8edf4 0%, #dbeafe 100%)";

  return (
    <div
      className="fixed inset-0 -z-10 transition-[background] duration-[1500ms]"
      style={{ background: theme === "light" ? lightBg : darkBg }}
      aria-hidden
    />
  );
}

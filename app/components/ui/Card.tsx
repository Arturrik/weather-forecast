import { cn } from "../../lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export function Card({ className, shimmer, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "surface-card rounded-2xl p-6",
        shimmer && "animate-pulse opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

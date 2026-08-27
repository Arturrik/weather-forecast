"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const sizes = {
      md: "min-h-[44px] px-6 py-2.5 text-[15px]",
      lg: "min-h-[50px] px-8 py-3 text-base",
    };

    const variants = {
      primary: "btn-apple-primary",
      secondary: "btn-apple-secondary",
      ghost: "btn-apple-ghost",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-sans font-semibold",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--btn-primary-bg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 disabled:active:scale-100",
          sizes[size],
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

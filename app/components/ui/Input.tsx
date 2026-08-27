"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  useId,
  useState,
} from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, value, type, onFocus, onBlur, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [focused, setFocused] = useState(false);
    const isDate = type === "date";
    const hasValue = value != null && String(value).length > 0;
    const labelFloated = focused || hasValue || isDate;

    return (
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          className={cn(
            "peer w-full rounded-xl border px-4 font-sans font-medium transition-colors duration-150",
            "focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20",
            isDate ? "h-14 pb-2 pt-7" : "pb-2 pt-6",
            className
          )}
          style={{
            borderColor: "var(--surface-border)",
            backgroundColor: "var(--input-bg)",
            color: "var(--input-text)",
          }}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute left-4 transition-all duration-200",
            labelFloated
              ? "top-2 text-xs text-blue-500/80"
              : "top-1/2 -translate-y-1/2 text-sm"
          )}
          style={{ color: labelFloated ? undefined : "var(--label-color)" }}
        >
          {label}
        </label>
      </div>
    );
  }
);

Input.displayName = "Input";

import { cn } from "@/lib/utils";
import * as React from "react";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide",
        variant === "default"
          ? "bg-accent text-foreground border border-border"
          : "border border-border text-foreground/80",
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

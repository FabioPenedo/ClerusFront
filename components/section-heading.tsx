import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  action
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "",
        className
      )}
    >
      {eyebrow ? (
        <div className="badge bg-accent text-xs text-foreground/90">{eyebrow}</div>
      ) : null}
      <div className="flex items-start gap-3">
        <div className="h-6 w-1 rounded-full bg-primary/80" />
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">{title}</h2>
          {subtitle ? (
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          ) : null}
        </div>
        {action}
      </div>
    </div>
  );
}


import { cn } from "@/lib/utils";

export function Prose({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose prose-zinc max-w-none dark:prose-invert prose-a:underline prose-a:underline-offset-4",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

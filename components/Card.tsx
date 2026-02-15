
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  title,
  description,
  href,
  children,
  className,
}: {
  title: string;
  description?: string;
  href?: string;
  children?: ReactNode;
  className?: string;
}) {
  const inner = (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-950",
        className
      )}
    >
      <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </div>
      {description ? (
        <div className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {description}
        </div>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );

  if (!href) return inner;

  return (
    <Link href={href} className="block">
      {inner}
    </Link>
  );
}

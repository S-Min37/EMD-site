
import Image from "next/image";
import { cn } from "@/lib/utils";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name,
  photo,
  size = 48,
  className,
}: {
  name: string;
  photo?: string;
  size?: number;
  className?: string;
}) {
  if (photo) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-800",
          className
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src={photo}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid place-items-center rounded-full border border-zinc-200 bg-zinc-50 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200",
        className
      )}
      style={{ width: size, height: size }}
      aria-label={name}
      title={name}
    >
      {initials(name)}
    </div>
  );
}

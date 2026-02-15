
import clsx from "clsx";

export function cn(...inputs: Array<string | undefined | null | false>) {
  return clsx(inputs);
}

export function formatDate(dateStr: string, locale = "ko-KR") {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function editLink(repoEditBase: string, filePath: string) {
  if (!repoEditBase) return "";
  return `${repoEditBase.replace(/\/$/, "")}/${filePath.replace(/^\//, "")}`;
}

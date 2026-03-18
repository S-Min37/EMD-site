import type {CmsGalleryImage} from "@/lib/cms";

export function Gallery({
  images,
  columns = 2,
}: {
  images: CmsGalleryImage[];
  columns?: 2 | 3;
}) {
  if (!images.length) return null;

  return (
    <div
      className={
        columns === 3
          ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          : "grid gap-6 md:grid-cols-2"
      }
    >
      {images.map((image) => (
        <figure
          key={`${image.src}-${image.caption ?? image.alt ?? "image"}`}
          className="overflow-hidden rounded-3xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950"
        >
          <div className="bg-zinc-100 dark:bg-zinc-900/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt ?? ""}
              className="h-full max-h-[360px] w-full object-cover"
            />
          </div>
          {image.caption ? (
            <figcaption className="border-t border-zinc-200/70 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800/70 dark:text-zinc-300">
              {image.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

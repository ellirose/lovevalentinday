// Images and icons from assets/ (made by Codex or by hand), optimized by scripts/assets.mjs.
import { icons, images, type AssetIconName, type ImageName } from "@/content/assets.generated";

type ImageProps = {
  name: ImageName;
  /** Overrides the alt text from assets/images/<name>.json. Use "" for decoration. */
  alt?: string;
  className?: string;
  /** How wide the image is shown, so the browser picks the right file. */
  sizes?: string;
  /** Load at once (above the fold) instead of lazily. */
  priority?: boolean;
};

export function AssetImage({ name, alt, className, sizes = "100vw", priority = false }: ImageProps) {
  const img = images[name];
  return (
    <picture>
      {img.avif && <source type="image/avif" srcSet={img.avif} sizes={sizes} />}
      {img.webp && <source type="image/webp" srcSet={img.webp} sizes={sizes} />}
      <img
        src={img.src}
        srcSet={img.fallback}
        sizes={sizes}
        width={img.width}
        height={img.height}
        alt={alt ?? img.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={className}
      />
    </picture>
  );
}

type IconProps = {
  name: AssetIconName;
  className?: string;
  /** Spoken label. Without it the icon is decorative. */
  title?: string;
};

/** Inline icon: lines take the text colour (set it with text-rose, text-ink…), the gold accent stays gold. */
export function AssetIcon({ name, className = "size-6", title }: IconProps) {
  return (
    <span
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={`inline-block shrink-0 ${className}`}
      // Markup comes from assets/icons and is cleaned by scripts/assets.mjs (no scripts, styles or links).
      dangerouslySetInnerHTML={{ __html: icons[name] }}
    />
  );
}

import Image from "next/image";

import { BrowserFrame } from "@/components/marketing/product/BrowserFrame";
import type { PlatformWorkspaceId } from "@/lib/marketing/platform";
import type { ProductMedia } from "@/lib/marketing/product-media";
import {
  PRODUCT_SCREENSHOT_ASPECT_RATIO,
  PRODUCT_SCREENSHOT_HEIGHT,
  PRODUCT_SCREENSHOT_WIDTH,
} from "@/lib/marketing/product-media";
import { cn } from "@/lib/utils";

type Props = {
  workspace: PlatformWorkspaceId;
  title: string;
  productUrl: string;
  alt: string;
  media?: ProductMedia;
  image?: string | null;
  priority?: boolean;
  className?: string;
  frameAriaHidden?: boolean;
};

function resolveImageSrc(
  media: ProductMedia | undefined,
  image: string | null | undefined
): string | null {
  if (image) return image;
  if (media?.type === "image") return media.src;
  return null;
}

function ProductScreenshotPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-[72%] w-[88%] rounded-[var(--mkt-radius-lg)] border border-dashed border-[var(--mkt-border-default)] bg-[var(--mkt-surface-1)]" />
    </div>
  );
}

function ProductScreenshotImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={PRODUCT_SCREENSHOT_WIDTH}
      height={PRODUCT_SCREENSHOT_HEIGHT}
      unoptimized
      priority={priority}
      loading={priority ? undefined : "lazy"}
      className="absolute inset-0 h-full w-full object-cover object-left-top"
    />
  );
}

function ProductScreenshotVideo({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string;
  title: string;
}) {
  return (
    <video
      className="absolute inset-0 h-full w-full object-cover object-left-top"
      src={src}
      poster={poster}
      muted
      playsInline
      preload="metadata"
      aria-label={title}
    />
  );
}

function ProductScreenshotInteractive({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  return (
    <iframe
      title={title}
      src={src}
      className="absolute inset-0 h-full w-full border-0"
      loading="lazy"
    />
  );
}

function ProductScreenshotMedia({
  media,
  imageSrc,
  alt,
  title,
  priority,
}: {
  media: ProductMedia | undefined;
  imageSrc: string | null;
  alt: string;
  title: string;
  priority: boolean;
}) {
  if (imageSrc) {
    return <ProductScreenshotImage src={imageSrc} alt={alt} priority={priority} />;
  }

  if (media?.type === "video") {
    return (
      <ProductScreenshotVideo
        src={media.src}
        poster={media.poster}
        title={title}
      />
    );
  }

  if (media?.type === "interactive") {
    return <ProductScreenshotInteractive src={media.src} title={title} />;
  }

  return <ProductScreenshotPlaceholder />;
}

export function ProductScreenshot({
  workspace,
  title,
  productUrl,
  alt,
  media,
  image,
  priority = false,
  className,
  frameAriaHidden = true,
}: Props) {
  const imageSrc = resolveImageSrc(media, image);

  return (
    <figure
      className={cn("m-0", className)}
      data-workspace={workspace}
      aria-label={title}
    >
      <BrowserFrame
        productUrl={productUrl}
        ariaHidden={frameAriaHidden}
        contentClassName="overflow-hidden"
      >
        <ProductScreenshotMedia
          media={media}
          imageSrc={imageSrc}
          alt={alt}
          title={title}
          priority={priority}
        />
      </BrowserFrame>
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
}

export {
  PRODUCT_SCREENSHOT_ASPECT_RATIO,
  PRODUCT_SCREENSHOT_HEIGHT,
  PRODUCT_SCREENSHOT_WIDTH,
};

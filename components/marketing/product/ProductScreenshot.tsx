import Image from "next/image";

import { BrowserFrame } from "@/components/marketing/product/BrowserFrame";
import type { PlatformWorkspaceId } from "@/lib/marketing/platform";
import type { ProductMedia } from "@/lib/marketing/product-media";
import {
  PRODUCT_SCREENSHOT_HEIGHT,
  PRODUCT_SCREENSHOT_WIDTH,
} from "@/lib/marketing/product-media";
import type {
  ProductPresentation,
  ProductScreenshotCrop,
  ProductShowcaseSize,
} from "@/lib/marketing/product-presentation";
import {
  getProductPresentation,
  mktProductShowcaseClass,
  mktProductShowcaseEmphasisClass,
  mktProductShowcaseOverlapClass,
  type ProductPresentationPreset,
} from "@/lib/marketing/product-presentation";
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
  size?: ProductShowcaseSize;
  crop?: ProductScreenshotCrop;
  presentation?: ProductPresentationPreset;
  emphasis?: boolean;
  overlap?: boolean;
};

function resolveImageSrc(
  media: ProductMedia | undefined,
  image: string | null | undefined
): string | null {
  if (image) return image;
  if (media?.type === "image") return media.src;
  return null;
}

function resolvePresentation(props: Props): ProductPresentation {
  if (props.presentation) {
    return getProductPresentation(props.presentation);
  }

  return {
    size: props.size ?? "section",
    crop: props.crop ?? { objectPosition: "0% 0%" },
    emphasis: props.emphasis,
    overlap: props.overlap,
  };
}

function ProductScreenshotPlaceholder() {
  return (
    <div className="mkt-browser-placeholder">
      <div className="mkt-browser-placeholder-panel" />
    </div>
  );
}

function ProductScreenshotImage({
  src,
  alt,
  priority,
  crop,
}: {
  src: string;
  alt: string;
  priority: boolean;
  crop: ProductScreenshotCrop;
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
      className="mkt-browser-screenshot"
      style={{ objectPosition: crop.objectPosition }}
    />
  );
}

function ProductScreenshotVideo({
  src,
  poster,
  title,
  crop,
}: {
  src: string;
  poster?: string;
  title: string;
  crop: ProductScreenshotCrop;
}) {
  return (
    <video
      className="mkt-browser-screenshot"
      style={{ objectPosition: crop.objectPosition }}
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
      className="mkt-browser-screenshot mkt-browser-screenshot--interactive"
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
  crop,
}: {
  media: ProductMedia | undefined;
  imageSrc: string | null;
  alt: string;
  title: string;
  priority: boolean;
  crop: ProductScreenshotCrop;
}) {
  if (imageSrc) {
    return (
      <ProductScreenshotImage
        src={imageSrc}
        alt={alt}
        priority={priority}
        crop={crop}
      />
    );
  }

  if (media?.type === "video") {
    return (
      <ProductScreenshotVideo
        src={media.src}
        poster={media.poster}
        title={title}
        crop={crop}
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
  presentation,
  size,
  crop,
  emphasis,
  overlap,
}: Props) {
  const resolved = resolvePresentation({
    workspace,
    title,
    productUrl,
    alt,
    media,
    image,
    priority,
    className,
    frameAriaHidden,
    presentation,
    size,
    crop,
    emphasis,
    overlap,
  });

  const showEmphasis = emphasis ?? resolved.emphasis;
  const showOverlap = overlap ?? resolved.overlap;

  return (
    <figure
      className={cn(
        mktProductShowcaseClass,
        `mkt-product-showcase--${resolved.size}`,
        showEmphasis && mktProductShowcaseEmphasisClass,
        showOverlap && mktProductShowcaseOverlapClass,
        className
      )}
      data-workspace={workspace}
      aria-label={title}
    >
      <BrowserFrame
        productUrl={productUrl}
        ariaHidden={frameAriaHidden}
        size={resolved.size}
        contentClassName="mkt-browser-content--media"
      >
        <ProductScreenshotMedia
          media={media}
          imageSrc={resolveImageSrc(media, image)}
          alt={alt}
          title={title}
          priority={priority}
          crop={resolved.crop}
        />
      </BrowserFrame>
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
}

export { PRODUCT_SCREENSHOT_HEIGHT, PRODUCT_SCREENSHOT_WIDTH };

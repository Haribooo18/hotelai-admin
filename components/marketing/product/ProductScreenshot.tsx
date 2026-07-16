import Image from "next/image";

import { BrowserFrame } from "@/components/marketing/product/BrowserFrame";
import { BookingsMockup } from "@/components/marketing/product/mockups/BookingsMockup";
import { CalendarMockup } from "@/components/marketing/product/mockups/CalendarMockup";
import { DashboardMockup } from "@/components/marketing/product/mockups/DashboardMockup";
import { GuestsMockup } from "@/components/marketing/product/mockups/GuestsMockup";
import { KnowledgeMockup } from "@/components/marketing/product/mockups/KnowledgeMockup";
import { ReceptionAiMockup } from "@/components/marketing/product/mockups/ReceptionAiMockup";
import { RevenueMockup } from "@/components/marketing/product/mockups/RevenueMockup";
import { RoomsMockup } from "@/components/marketing/product/mockups/RoomsMockup";
import type { PlatformWorkspaceId } from "@/lib/marketing/platform";
import type { ProductComponentMedia, ProductMedia } from "@/lib/marketing/product-media";
import { PRODUCT_SCREENSHOT_HEIGHT, PRODUCT_SCREENSHOT_WIDTH } from "@/lib/marketing/product-media";
import type { ProductPresentation, ProductScreenshotCrop, ProductShowcaseSize } from "@/lib/marketing/product-presentation";
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
  tabTitle?: string;
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

function resolveImageSrc(media: ProductMedia | undefined, image: string | null | undefined): string | null {
  if (image) return image;
  if (media?.type === "image") return media.src;
  return null;
}

function resolvePresentation(props: Props): ProductPresentation {
  if (props.presentation) return getProductPresentation(props.presentation);
  return {
    size: props.size ?? "section",
    crop: props.crop ?? { objectPosition: "0% 0%" },
    emphasis: props.emphasis,
    overlap: props.overlap,
  };
}

function ProductScreenshotPlaceholder() {
  return <div className="mkt-browser-placeholder"><div className="mkt-browser-placeholder-panel" /></div>;
}

function ProductScreenshotImage({ src, alt, priority, crop }: { src: string; alt: string; priority: boolean; crop: ProductScreenshotCrop }) {
  return <Image src={src} alt={alt} width={PRODUCT_SCREENSHOT_WIDTH} height={PRODUCT_SCREENSHOT_HEIGHT} unoptimized priority={priority} loading={priority ? undefined : "lazy"} className="mkt-browser-screenshot" style={{ objectPosition: crop.objectPosition }} />;
}

function ProductScreenshotVideo({ src, poster, title, crop }: { src: string; poster?: string; title: string; crop: ProductScreenshotCrop }) {
  return <video className="mkt-browser-screenshot" style={{ objectPosition: crop.objectPosition }} src={src} poster={poster} muted playsInline preload="metadata" aria-label={title} />;
}

function ProductScreenshotInteractive({ src, title }: { src: string; title: string }) {
  return <iframe title={title} src={src} className="mkt-browser-screenshot mkt-browser-screenshot--interactive" loading="lazy" />;
}

function ProductScreenshotComponent({ media, title }: { media: ProductComponentMedia; title: string }) {
  const content =
    media.component === "dashboard" ? <DashboardMockup /> :
    media.component === "bookings" ? <BookingsMockup /> :
    media.component === "guests" ? <GuestsMockup /> :
    media.component === "rooms" ? <RoomsMockup /> :
    media.component === "calendar" ? <CalendarMockup /> :
    media.component === "revenue" ? <RevenueMockup /> :
    media.component === "knowledge" ? <KnowledgeMockup /> :
    media.component === "reception-ai" ? <ReceptionAiMockup /> :
    null;

  if (!content) return <ProductScreenshotPlaceholder />;

  return <div className="h-full w-full overflow-hidden" role="img" aria-label={title}>{content}</div>;
}

function ProductScreenshotMedia({ media, imageSrc, alt, title, priority, crop }: {
  media: ProductMedia | undefined; imageSrc: string | null; alt: string; title: string; priority: boolean; crop: ProductScreenshotCrop;
}) {
  if (imageSrc) return <ProductScreenshotImage src={imageSrc} alt={alt} priority={priority} crop={crop} />;
  if (media?.type === "video") return <ProductScreenshotVideo src={media.src} poster={media.poster} title={title} crop={crop} />;
  if (media?.type === "interactive") return <ProductScreenshotInteractive src={media.src} title={title} />;
  if (media?.type === "component") return <ProductScreenshotComponent media={media} title={title} />;
  return <ProductScreenshotPlaceholder />;
}

export function ProductScreenshot({
  workspace,
  title,
  tabTitle,
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
    workspace, title, tabTitle, productUrl, alt, media, image, priority, className,
    frameAriaHidden, presentation, size, crop, emphasis, overlap,
  });
  const showEmphasis = emphasis ?? resolved.emphasis;
  const showOverlap = overlap ?? resolved.overlap;

  return (
    <figure
      className={cn(
        mktProductShowcaseClass,
        `mkt-product-showcase--${resolved.size}`,
        "mkt-product-showcase--unified",
        showEmphasis && mktProductShowcaseEmphasisClass,
        showOverlap && mktProductShowcaseOverlapClass,
        className
      )}
      data-workspace={workspace}
      aria-label={title}
    >
      <BrowserFrame
        productUrl={productUrl}
        tabTitle={tabTitle}
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

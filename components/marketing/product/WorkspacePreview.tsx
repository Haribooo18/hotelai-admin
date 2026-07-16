import { ProductScreenshot } from "@/components/marketing/product/ProductScreenshot";
import type { PlatformWorkspaceId } from "@/lib/marketing/platform";
import { PLATFORM_DEFAULT_WORKSPACE_ID } from "@/lib/marketing/platform";
import type { ProductPresentationPreset } from "@/lib/marketing/product-presentation";
import { getWorkspacePreview } from "@/lib/marketing/workspace-previews";

type Props = {
  workspaceId?: PlatformWorkspaceId;
  priority?: boolean;
  className?: string;
  presentation?: ProductPresentationPreset;
};

export function WorkspacePreview({
  workspaceId = PLATFORM_DEFAULT_WORKSPACE_ID,
  priority = false,
  className,
  presentation,
}: Props) {
  const preview = getWorkspacePreview(workspaceId);

  return (
    <ProductScreenshot
      workspace={preview.workspace}
      title={preview.title}
      productUrl={preview.productUrl}
      alt={preview.alt}
      media={preview.media}
      priority={priority}
      className={className}
      presentation={presentation}
    />
  );
}

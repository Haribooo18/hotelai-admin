import {
  WorkspacePageSkeleton,
  type WorkspacePageSkeletonVariant,
} from "@/components/dashboard/shared/skeleton";

type Props = {
  label: string;
  variant?: WorkspacePageSkeletonVariant;
  /** @deprecated Use `variant` on `WorkspacePageSkeleton`. */
  kpiCount?: number;
  /** @deprecated Use `variant` on `WorkspacePageSkeleton`. */
  kpiGridClassName?: string;
  /** @deprecated Use `variant` on `WorkspacePageSkeleton`. */
  children?: React.ReactNode;
};

/** @deprecated Prefer `WorkspacePageSkeleton` with a `variant` prop. */
export function WorkspaceRouteSkeleton({
  label,
  variant = "generic",
}: Props) {
  return <WorkspacePageSkeleton label={label} variant={variant} />;
}

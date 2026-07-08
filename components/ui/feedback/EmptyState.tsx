import type { ReactNode } from "react";

import {
  emptyStateCtaGapClass,
  emptyStateDescriptionClass,
  emptyStateIconClass,
  emptyStateInnerClass,
  shellEmptyStateClass,
} from "@/lib/dashboard/design-system";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className={shellEmptyStateClass}>
      <div className={emptyStateInnerClass}>
        {icon ? <div className={emptyStateIconClass}>{icon}</div> : null}
        <p className="ds-section-title">{title}</p>
        <p className={emptyStateDescriptionClass}>{description}</p>
        {action ? <div className={emptyStateCtaGapClass}>{action}</div> : null}
      </div>
    </div>
  );
}

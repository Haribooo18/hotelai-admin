import { detailRowClass, detailRowValueClass } from "@/lib/dashboard/design-system";

type Props = {
  label: string;
  value: string;
};

export function WorkspaceDetailRow({ label, value }: Props) {
  return (
    <div className={detailRowClass}>
      <dt>{label}</dt>
      <dd className={detailRowValueClass}>{value}</dd>
    </div>
  );
}

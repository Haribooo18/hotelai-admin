import { TRUST_METRICS } from "@/lib/marketing/trust";

export function TrustMetricsStrip() {
  return (
    <div className="mkt-trust-metrics" role="list" aria-label="Platform highlights">
      {TRUST_METRICS.map((metric) => (
        <p key={metric.id} className="mkt-trust-metric" role="listitem">
          {metric.label}
        </p>
      ))}
    </div>
  );
}

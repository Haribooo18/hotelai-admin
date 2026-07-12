import {
  MONAVEL_IN_ACTION_STATUS,
  MONAVEL_IN_ACTION_STEPS,
  MONAVEL_IN_ACTION_TITLE,
} from "@/lib/marketing/why-hotels-need";

const ACCENT = "#00C389";

type StepIconName = (typeof MONAVEL_IN_ACTION_STEPS)[number]["icon"];

function StepIcon({ icon }: { icon: StepIconName }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={ACCENT}
      strokeWidth={1.15}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icon === "guest" && (
        <>
          <circle cx="7" cy="4.5" r="2.5" />
          <path d="M1.5 13 C1.5 9.5 4 7.5 7 7.5 C10 7.5 12.5 9.5 12.5 13" />
        </>
      )}
      {icon === "whatsapp" && (
        <path d="M7 1.5 C4 1.5 1.5 4 1.5 7 C1.5 8 1.8 9 2.3 9.8 L1.5 12.5 L4.2 11.7 C5 12.1 6 12.5 7 12.5 C10 12.5 12.5 10 12.5 7 C12.5 4 10 1.5 7 1.5 Z" />
      )}
      {icon === "ai" && <path d="M7 1 L8.4 5.6 L13 7 L8.4 8.4 L7 13 L5.6 8.4 L1 7 L5.6 5.6 Z" />}
      {icon === "knowledge" && (
        <>
          <path d="M1 1.5 H13 V12.5 H1 Z" />
          <path d="M4 1.5 V12.5" />
          <path d="M6.5 5 H10.5" strokeWidth={1} />
        </>
      )}
      {icon === "check" && (
        <>
          <circle cx="7" cy="7" r="6" />
          <path d="M4 7 L6.3 9.3 L10 5" />
        </>
      )}
    </svg>
  );
}

function StatusCheckIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M2 7 L5 10 L12 3"
        stroke={ACCENT}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MonavelInActionCard() {
  return (
    <div className="mkt-action-card">
      <p className="mkt-action-card-title">{MONAVEL_IN_ACTION_TITLE}</p>

      <ol className="mkt-action-steps">
        {MONAVEL_IN_ACTION_STEPS.map((step) => (
          <li key={step.label} className="mkt-action-step">
            <span className={`mkt-action-step-icon mkt-action-step-icon--${step.icon}`}>
              <StepIcon icon={step.icon} />
            </span>
            <span className="mkt-action-step-label">{step.label}</span>
          </li>
        ))}
      </ol>

      <div className="mkt-action-divider" role="presentation" />

      <ul className="mkt-action-status">
        {MONAVEL_IN_ACTION_STATUS.map((item) => (
          <li key={item} className="mkt-action-status-item">
            <StatusCheckIcon />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

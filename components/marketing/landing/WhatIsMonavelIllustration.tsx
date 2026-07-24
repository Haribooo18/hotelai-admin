type Props = {
  cardId: string;
};

export function WhatIsMonavelIllustration({ cardId }: Props) {
  return (
    <div className="mkt-what-is-illustration" aria-hidden>
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="mkt-what-is-illustration-svg">
        <rect width="120" height="80" rx="10" fill="#141820" />
        {cardId === "one-workspace" && (
          <>
            <rect x="16" y="20" width="32" height="24" rx="4" fill="#171b22" stroke="#ffffff" strokeOpacity="0.08" />
            <rect x="52" y="20" width="32" height="24" rx="4" fill="#171b22" stroke="#ffffff" strokeOpacity="0.08" />
            <rect x="88" y="20" width="16" height="24" rx="4" fill="#1f5b4c22" />
            <rect x="24" y="52" width="72" height="12" rx="4" fill="#1f5b4c33" />
          </>
        )}
        {cardId === "ai-reception" && (
          <>
            <rect x="20" y="24" width="56" height="20" rx="6" fill="#171b22" stroke="#ffffff" strokeOpacity="0.08" />
            <rect x="52" y="48" width="48" height="20" rx="6" fill="#1f5b4c18" stroke="#1f5b4c" strokeOpacity="0.25" />
            <circle cx="30" cy="34" r="3" fill="#1f5b4c" />
          </>
        )}
        {cardId === "connected-data" && (
          <>
            <circle cx="40" cy="40" r="10" fill="#1f5b4c22" stroke="#1f5b4c" strokeOpacity="0.3" />
            <circle cx="80" cy="28" r="8" fill="#171b22" stroke="#ffffff" strokeOpacity="0.08" />
            <circle cx="80" cy="52" r="8" fill="#171b22" stroke="#ffffff" strokeOpacity="0.08" />
            <path d="M48 36 L72 30" stroke="#1f5b4c" strokeOpacity="0.35" strokeWidth="1" />
            <path d="M48 44 L72 48" stroke="#1f5b4c" strokeOpacity="0.35" strokeWidth="1" />
          </>
        )}
        {cardId === "automation" && (
          <>
            <rect x="24" y="28" width="72" height="8" rx="4" fill="#171b22" />
            <rect x="24" y="28" width="48" height="8" rx="4" fill="#1f5b4c44" />
            <rect x="24" y="44" width="72" height="8" rx="4" fill="#171b22" />
            <rect x="24" y="44" width="60" height="8" rx="4" fill="#1f5b4c33" />
          </>
        )}
        {cardId === "revenue-intelligence" && (
          <>
            <polyline points="24,56 40,44 56,48 72,36 88,40 104,28" fill="none" stroke="#1f5b4c" strokeWidth="1.5" strokeOpacity="0.55" />
            <text x="24" y="68" fill="#9ca3af" fontFamily="system-ui,sans-serif" fontSize="8">ADR · RevPAR</text>
          </>
        )}
        {cardId === "enterprise-security" && (
          <>
            <rect x="44" y="28" width="32" height="36" rx="6" fill="#171b22" stroke="#1f5b4c" strokeOpacity="0.25" />
            <path d="M52 40 L60 46 L72 34" stroke="#1f5b4c" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
            <rect x="24" y="56" width="72" height="6" rx="3" fill="#141820" />
          </>
        )}
      </svg>
    </div>
  );
}

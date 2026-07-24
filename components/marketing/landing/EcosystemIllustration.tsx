export function EcosystemIllustration() {
  return (
    <figure className="mkt-ecosystem-illustration" aria-hidden>
      <svg
        viewBox="0 0 480 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mkt-ecosystem-illustration-svg"
      >
        <rect width="480" height="480" rx="20" fill="#12151b" />
        <rect x="0.5" y="0.5" width="479" height="479" rx="19.5" stroke="#ffffff" strokeOpacity="0.08" />

        <circle cx="240" cy="240" r="44" fill="#1f5b4c18" stroke="#1f5b4c" strokeOpacity="0.45" />
        <text x="240" y="236" textAnchor="middle" fill="#e8eaed" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="600">Monavel</text>
        <text x="240" y="252" textAnchor="middle" fill="#6b7280" fontFamily="system-ui,sans-serif" fontSize="9">Ecosystem</text>

        <rect x="196" y="72" width="88" height="36" rx="10" fill="#171b22" stroke="#ffffff" strokeOpacity="0.1" />
        <text x="240" y="95" textAnchor="middle" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="11">Guests</text>

        <rect x="56" y="148" width="88" height="36" rx="10" fill="#171b22" stroke="#ffffff" strokeOpacity="0.1" />
        <text x="100" y="171" textAnchor="middle" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="11">Channels</text>

        <rect x="336" y="148" width="88" height="36" rx="10" fill="#171b22" stroke="#ffffff" strokeOpacity="0.1" />
        <text x="380" y="171" textAnchor="middle" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="11">Revenue</text>

        <rect x="56" y="316" width="88" height="36" rx="10" fill="#171b22" stroke="#ffffff" strokeOpacity="0.1" />
        <text x="100" y="339" textAnchor="middle" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="11">Operations</text>

        <rect x="336" y="316" width="88" height="36" rx="10" fill="#171b22" stroke="#ffffff" strokeOpacity="0.1" />
        <text x="380" y="339" textAnchor="middle" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="11">Automation</text>

        <rect x="196" y="392" width="88" height="36" rx="10" fill="#171b22" stroke="#ffffff" strokeOpacity="0.1" />
        <text x="240" y="415" textAnchor="middle" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="11">Intelligence</text>

        <path d="M240 108 L240 196" stroke="#1f5b4c" strokeOpacity="0.3" strokeWidth="1.5" />
        <path d="M100 184 L180 220" stroke="#1f5b4c" strokeOpacity="0.2" strokeWidth="1.5" />
        <path d="M380 184 L300 220" stroke="#1f5b4c" strokeOpacity="0.2" strokeWidth="1.5" />
        <path d="M100 316 L180 280" stroke="#1f5b4c" strokeOpacity="0.2" strokeWidth="1.5" />
        <path d="M380 316 L300 280" stroke="#1f5b4c" strokeOpacity="0.2" strokeWidth="1.5" />
        <path d="M240 284 L240 392" stroke="#1f5b4c" strokeOpacity="0.3" strokeWidth="1.5" />

        <circle cx="240" cy="240" r="64" fill="none" stroke="#1f5b4c" strokeOpacity="0.1" className="mkt-ecosystem-pulse" />
      </svg>
    </figure>
  );
}

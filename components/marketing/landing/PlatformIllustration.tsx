export function PlatformIllustration() {
  return (
    <figure className="mkt-platform-illustration" aria-hidden>
      <svg
        viewBox="0 0 480 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mkt-platform-illustration-svg"
      >
        <rect width="480" height="520" rx="20" fill="#12151b" />
        <rect
          x="0.5"
          y="0.5"
          width="479"
          height="519"
          rx="19.5"
          stroke="#ffffff"
          strokeOpacity="0.08"
        />

        {/* Center hub */}
        <circle cx="240" cy="260" r="36" fill="#10b98122" stroke="#10b981" strokeOpacity="0.4" />
        <text
          x="240"
          y="256"
          textAnchor="middle"
          fill="#e8eaed"
          fontFamily="system-ui,sans-serif"
          fontSize="11"
          fontWeight="600"
        >
          Monavel
        </text>
        <text
          x="240"
          y="272"
          textAnchor="middle"
          fill="#6b7280"
          fontFamily="system-ui,sans-serif"
          fontSize="9"
        >
          Platform
        </text>

        {/* Nodes */}
        <g className="mkt-platform-illustration-node" data-node="ai">
          <rect x="196" y="72" width="88" height="40" rx="10" fill="#171b22" stroke="#ffffff" strokeOpacity="0.1" />
          <text x="240" y="97" textAnchor="middle" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="11" fontWeight="500">AI</text>
        </g>
        <g className="mkt-platform-illustration-node" data-node="knowledge">
          <rect x="56" y="156" width="104" height="40" rx="10" fill="#171b22" stroke="#ffffff" strokeOpacity="0.1" />
          <text x="108" y="181" textAnchor="middle" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="11" fontWeight="500">Knowledge</text>
        </g>
        <g className="mkt-platform-illustration-node" data-node="guests">
          <rect x="320" y="156" width="104" height="40" rx="10" fill="#171b22" stroke="#ffffff" strokeOpacity="0.1" />
          <text x="372" y="181" textAnchor="middle" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="11" fontWeight="500">Guests</text>
        </g>
        <g className="mkt-platform-illustration-node" data-node="revenue">
          <rect x="56" y="324" width="104" height="40" rx="10" fill="#171b22" stroke="#ffffff" strokeOpacity="0.1" />
          <text x="108" y="349" textAnchor="middle" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="11" fontWeight="500">Revenue</text>
        </g>
        <g className="mkt-platform-illustration-node" data-node="automation">
          <rect x="320" y="324" width="104" height="40" rx="10" fill="#171b22" stroke="#ffffff" strokeOpacity="0.1" />
          <text x="372" y="349" textAnchor="middle" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="11" fontWeight="500">Automation</text>
        </g>
        <g className="mkt-platform-illustration-node" data-node="operations">
          <rect x="196" y="408" width="88" height="40" rx="10" fill="#171b22" stroke="#ffffff" strokeOpacity="0.1" />
          <text x="240" y="433" textAnchor="middle" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="11" fontWeight="500">Operations</text>
        </g>

        {/* Connector lines */}
        <path d="M240 112 L240 224" stroke="#10b981" strokeOpacity="0.35" strokeWidth="1.5" />
        <path d="M196 176 L204 224" stroke="#10b981" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M284 176 L276 224" stroke="#10b981" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M108 196 L180 248" stroke="#10b981" strokeOpacity="0.2" strokeWidth="1.5" />
        <path d="M372 196 L300 248" stroke="#10b981" strokeOpacity="0.2" strokeWidth="1.5" />
        <path d="M204 296 L180 324" stroke="#10b981" strokeOpacity="0.2" strokeWidth="1.5" />
        <path d="M276 296 L300 324" stroke="#10b981" strokeOpacity="0.2" strokeWidth="1.5" />
        <path d="M240 296 L240 408" stroke="#10b981" strokeOpacity="0.35" strokeWidth="1.5" />
        <path d="M160 344 L210 280" stroke="#10b981" strokeOpacity="0.15" strokeWidth="1" />
        <path d="M320 344 L270 280" stroke="#10b981" strokeOpacity="0.15" strokeWidth="1" />

        {/* Subtle pulse on hub */}
        <circle cx="240" cy="260" r="48" fill="none" stroke="#10b981" strokeOpacity="0.12" className="mkt-platform-illustration-pulse" />
      </svg>
    </figure>
  );
}

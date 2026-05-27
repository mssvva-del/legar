/**
 * Inline SVG illustrations у стилі "geometric blueprint":
 *   - тонкі сині лінії (#1B4DFF, stroke-width 1.5)
 *   - жовті акценти (#FFD60A)
 *   - білий/світло-сірий фон
 * Жодних стокових фото та реалістичних людей.
 */

const PRIMARY = "#1B4DFF";
const ACCENT = "#FFD60A";
const SOFT = "#EBEFF8";

interface SVGProps {
  className?: string;
  ariaLabel?: string;
}

/** Hero — щит з літерою L + орбітальні елементи */
export function HeroShield({ className, ariaLabel }: SVGProps) {
  return (
    <svg
      viewBox="0 0 520 520"
      fill="none"
      role="img"
      aria-label={ariaLabel ?? "Юридичний щит LEGAR з орбітальними елементами"}
      className={className}
    >
      {/* Outer orbits */}
      <g className="orbit-slow" style={{ transformOrigin: "260px 260px" }}>
        <circle cx="260" cy="260" r="230" stroke={PRIMARY} strokeWidth="1" strokeDasharray="2 6" opacity="0.35" />
      </g>
      <g className="orbit-reverse" style={{ transformOrigin: "260px 260px" }}>
        <circle cx="260" cy="260" r="190" stroke={PRIMARY} strokeWidth="1" strokeDasharray="1 4" opacity="0.45" />
      </g>

      {/* Floating icon: document (top) */}
      <g transform="translate(220 30)">
        <rect width="80" height="60" rx="6" stroke={PRIMARY} strokeWidth="1.5" fill="white" />
        <line x1="14" y1="18" x2="66" y2="18" stroke={PRIMARY} strokeWidth="1.5" />
        <line x1="14" y1="30" x2="56" y2="30" stroke={PRIMARY} strokeWidth="1.5" />
        <line x1="14" y1="42" x2="44" y2="42" stroke={PRIMARY} strokeWidth="1.5" />
        <circle cx="68" cy="50" r="6" fill={ACCENT} />
      </g>

      {/* Floating icon: phone (right) */}
      <g transform="translate(460 220)">
        <rect width="40" height="68" rx="6" stroke={PRIMARY} strokeWidth="1.5" fill="white" />
        <circle cx="20" cy="58" r="3" fill={PRIMARY} />
        <line x1="14" y1="12" x2="26" y2="12" stroke={PRIMARY} strokeWidth="1.5" />
      </g>

      {/* Floating icon: lock (bottom) */}
      <g transform="translate(232 446)">
        <rect width="56" height="44" rx="6" stroke={PRIMARY} strokeWidth="1.5" fill="white" />
        <path
          d="M16 16 V10 a12 12 0 0 1 24 0 v6"
          stroke={PRIMARY}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="28" cy="28" r="4" fill={ACCENT} />
      </g>

      {/* Floating icon: check (left) */}
      <g transform="translate(28 232)">
        <circle cx="28" cy="28" r="28" stroke={PRIMARY} strokeWidth="1.5" fill="white" />
        <path
          d="M16 28 L25 37 L42 19"
          stroke={ACCENT}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Central shield */}
      <g className="shield-pulse" style={{ transformOrigin: "260px 260px" }}>
        {/* Shield silhouette */}
        <path
          d="M260 130 L370 170 V275 c0 60 -45 105 -110 130 c-65 -25 -110 -70 -110 -130 V170 Z"
          fill="white"
          stroke={PRIMARY}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Inner shield border */}
        <path
          d="M260 152 L350 184 V272 c0 50 -38 88 -90 110 c-52 -22 -90 -60 -90 -110 V184 Z"
          fill="none"
          stroke={PRIMARY}
          strokeWidth="1"
          opacity="0.4"
          strokeLinejoin="round"
        />
        {/* Yellow accent slash */}
        <path
          d="M260 175 L342 205 V268 c0 5 -2 9 -5 12"
          stroke={ACCENT}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Letter L */}
        <text
          x="260"
          y="305"
          textAnchor="middle"
          fontSize="120"
          fontWeight="800"
          fontFamily="var(--font-manrope), system-ui, sans-serif"
          fill={PRIMARY}
        >
          L
        </text>
        <circle cx="320" cy="300" r="7" fill={ACCENT} />
      </g>

      {/* Cross-hair grid (subtle) */}
      <line x1="0" y1="260" x2="520" y2="260" stroke={PRIMARY} strokeWidth="0.5" opacity="0.06" />
      <line x1="260" y1="0" x2="260" y2="520" stroke={PRIMARY} strokeWidth="0.5" opacity="0.06" />
    </svg>
  );
}

/** B2B — будівля з захищеними/незахищеними співробітниками */
export function B2BBuilding({ className, ariaLabel }: SVGProps) {
  return (
    <svg
      viewBox="0 0 520 420"
      role="img"
      aria-label={ariaLabel ?? "Будівля з захищеними співробітниками"}
      className={className}
      fill="none"
    >
      {/* Building */}
      <rect x="120" y="40" width="280" height="320" stroke={PRIMARY} strokeWidth="1.5" fill="white" />
      <line x1="120" y1="80" x2="400" y2="80" stroke={PRIMARY} strokeWidth="1" />
      {/* Windows grid */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => {
          const x = 150 + col * 60;
          const y = 100 + row * 50;
          const protected_ = (row + col) % 3 === 0;
          return (
            <g key={`${row}-${col}`}>
              <rect
                x={x}
                y={y}
                width="40"
                height="30"
                stroke={PRIMARY}
                strokeWidth="1"
                fill={protected_ ? ACCENT : "white"}
                opacity={protected_ ? 0.85 : 1}
              />
              <circle
                cx={x + 20}
                cy={y + 14}
                r="4"
                fill={protected_ ? PRIMARY : SOFT}
              />
            </g>
          );
        }),
      )}
      {/* Door */}
      <rect x="240" y="320" width="40" height="40" stroke={PRIMARY} strokeWidth="1.5" fill={ACCENT} />
      {/* Protective shield */}
      <path
        d="M40 200 L80 215 V275 c0 28 -20 50 -40 60 c-20 -10 -40 -32 -40 -60 V215 Z"
        transform="translate(420 60)"
        fill={ACCENT}
        opacity="0.18"
        stroke={ACCENT}
        strokeWidth="2"
      />
      <text
        x="460"
        y="160"
        textAnchor="middle"
        fontSize="32"
        fontWeight="800"
        fontFamily="var(--font-manrope), system-ui, sans-serif"
        fill={PRIMARY}
      >
        ✓
      </text>
      {/* Foundation line */}
      <line x1="80" y1="380" x2="440" y2="380" stroke={PRIMARY} strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );
}

/** Dot-pattern background для тёмних секцій */
export function DotPattern({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <pattern
          id="legar-dots"
          x="0"
          y="0"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1" fill={PRIMARY} opacity="0.18" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#legar-dots)" />
    </svg>
  );
}

/** Gradient blob — декор у hero */
export function HeroBlob({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <defs>
        <radialGradient id="blob-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={PRIMARY} stopOpacity="0.08" />
          <stop offset="60%" stopColor={PRIMARY} stopOpacity="0.02" />
          <stop offset="100%" stopColor={PRIMARY} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="280" fill="url(#blob-grad)" />
    </svg>
  );
}

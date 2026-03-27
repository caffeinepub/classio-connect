import type React from "react";

interface ModuleIconProps {
  moduleName: string;
  size?: number;
}

export function ModuleIcon({ moduleName, size = 48 }: ModuleIconProps) {
  const s = size;
  const icons: Record<string, React.ReactElement> = {
    "Vocabulary Builder": (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#dbeafe" />
        <rect x="10" y="14" width="28" height="20" rx="3" fill="#3b82f6" />
        <rect
          x="13"
          y="18"
          width="22"
          height="2.5"
          rx="1.2"
          fill="white"
          opacity="0.9"
        />
        <rect
          x="13"
          y="22.5"
          width="16"
          height="2.5"
          rx="1.2"
          fill="white"
          opacity="0.7"
        />
        <rect
          x="13"
          y="27"
          width="19"
          height="2.5"
          rx="1.2"
          fill="white"
          opacity="0.7"
        />
        <circle cx="35" cy="32" r="7" fill="#1d4ed8" />
        <text
          x="35"
          y="36"
          textAnchor="middle"
          fontSize="9"
          fill="white"
          fontWeight="bold"
        >
          A
        </text>
      </svg>
    ),
    "Grammar Essentials": (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#dcfce7" />
        <rect x="12" y="10" width="24" height="28" rx="3" fill="#16a34a" />
        <rect
          x="15"
          y="15"
          width="18"
          height="2.2"
          rx="1"
          fill="white"
          opacity="0.9"
        />
        <rect
          x="15"
          y="19.5"
          width="14"
          height="2.2"
          rx="1"
          fill="white"
          opacity="0.7"
        />
        <rect
          x="15"
          y="24"
          width="16"
          height="2.2"
          rx="1"
          fill="white"
          opacity="0.7"
        />
        <rect
          x="15"
          y="28.5"
          width="12"
          height="2.2"
          rx="1"
          fill="white"
          opacity="0.7"
        />
        <circle cx="34" cy="34" r="7" fill="#166534" />
        <text
          x="34"
          y="38"
          textAnchor="middle"
          fontSize="9"
          fill="white"
          fontWeight="bold"
        >
          G
        </text>
      </svg>
    ),
    "Pronunciation Practice": (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#f3e8ff" />
        <rect x="19" y="10" width="10" height="18" rx="5" fill="#9333ea" />
        <path
          d="M13 24 Q13 34 24 34 Q35 34 35 24"
          stroke="#9333ea"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <line
          x1="24"
          y1="34"
          x2="24"
          y2="39"
          stroke="#9333ea"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="19"
          y1="39"
          x2="29"
          y2="39"
          stroke="#9333ea"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="19" r="3" fill="white" opacity="0.4" />
      </svg>
    ),
    "Listening Skills": (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#cffafe" />
        <path
          d="M12 20 Q12 10 24 10 Q36 10 36 20 L36 28 Q36 36 29 36 L25 36"
          stroke="#0891b2"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="22" cy="36" r="3.5" fill="#0891b2" />
        <line
          x1="8"
          y1="22"
          x2="8"
          y2="28"
          stroke="#06b6d4"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="12"
          y1="19"
          x2="12"
          y2="31"
          stroke="#06b6d4"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="40"
          y1="22"
          x2="40"
          y2="28"
          stroke="#06b6d4"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="36"
          y1="19"
          x2="36"
          y2="31"
          stroke="#06b6d4"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    "Conversation Practice": (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#fce7f3" />
        <rect x="8" y="10" width="22" height="16" rx="4" fill="#ec4899" />
        <polygon points="12,26 8,32 18,26" fill="#ec4899" />
        <rect x="18" y="22" width="22" height="16" rx="4" fill="#be185d" />
        <polygon points="36,38 40,44 30,38" fill="#be185d" />
        <circle cx="15" cy="18" r="1.8" fill="white" opacity="0.9" />
        <circle cx="20" cy="18" r="1.8" fill="white" opacity="0.9" />
        <circle cx="25" cy="18" r="1.8" fill="white" opacity="0.9" />
        <circle cx="27" cy="30" r="1.5" fill="white" opacity="0.8" />
        <circle cx="32" cy="30" r="1.5" fill="white" opacity="0.8" />
      </svg>
    ),
    "Reading Comprehension": (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#e0e7ff" />
        <path d="M10 14 L24 8 L38 14 L38 38 L24 44 L10 38 Z" fill="#4f46e5" />
        <path d="M24 8 L24 44" stroke="#818cf8" strokeWidth="1.5" />
        <rect
          x="13"
          y="17"
          width="9"
          height="2"
          rx="1"
          fill="white"
          opacity="0.8"
        />
        <rect
          x="13"
          y="21"
          width="7"
          height="2"
          rx="1"
          fill="white"
          opacity="0.6"
        />
        <rect
          x="13"
          y="25"
          width="9"
          height="2"
          rx="1"
          fill="white"
          opacity="0.6"
        />
        <rect
          x="13"
          y="29"
          width="6"
          height="2"
          rx="1"
          fill="white"
          opacity="0.6"
        />
        <rect
          x="26"
          y="17"
          width="9"
          height="2"
          rx="1"
          fill="white"
          opacity="0.8"
        />
        <rect
          x="26"
          y="21"
          width="7"
          height="2"
          rx="1"
          fill="white"
          opacity="0.6"
        />
        <rect
          x="26"
          y="25"
          width="9"
          height="2"
          rx="1"
          fill="white"
          opacity="0.6"
        />
      </svg>
    ),
    "Shadowing Practice": (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#fef3c7" />
        <path
          d="M8 24 Q12 16 16 24 Q20 32 24 24 Q28 16 32 24 Q36 32 40 24"
          stroke="#d97706"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M10 30 Q14 22 18 30 Q22 38 26 30 Q30 22 34 30 Q38 38 42 30"
          stroke="#f59e0b"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
        <circle cx="24" cy="10" r="4" fill="#d97706" />
        <path
          d="M20 10 Q20 6 24 6 Q28 6 28 10"
          stroke="#fbbf24"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    ),
    "AI Roleplay": (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#fee2e2" />
        <rect x="14" y="8" width="20" height="24" rx="6" fill="#ef4444" />
        <circle cx="19" cy="18" r="2.5" fill="white" />
        <circle cx="29" cy="18" r="2.5" fill="white" />
        <path
          d="M18 25 Q24 30 30 25"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <rect x="21" y="32" width="6" height="6" rx="1" fill="#ef4444" />
        <rect x="16" y="38" width="16" height="4" rx="2" fill="#dc2626" />
        <circle cx="34" cy="12" r="5" fill="#f97316" />
        <text
          x="34"
          y="16"
          textAnchor="middle"
          fontSize="7"
          fill="white"
          fontWeight="bold"
        >
          AI
        </text>
      </svg>
    ),
    "Picture Speaking": (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#dcfce7" />
        <rect x="8" y="12" width="32" height="22" rx="3" fill="#059669" />
        <rect
          x="10"
          y="14"
          width="28"
          height="18"
          rx="2"
          fill="#34d399"
          opacity="0.3"
        />
        <circle cx="18" cy="20" r="3" fill="#fbbf24" />
        <path
          d="M10 30 L18 22 L24 28 L30 22 L38 32 L10 32 Z"
          fill="#059669"
          opacity="0.7"
        />
        <circle cx="37" cy="37" r="7" fill="#065f46" />
        <path
          d="M34 37 L37 40 L41 34"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "Fill-in-the-Conversation": (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#ede9fe" />
        <rect x="8" y="10" width="18" height="12" rx="3" fill="#7c3aed" />
        <polygon points="10,22 8,28 16,22" fill="#7c3aed" />
        <rect x="22" y="26" width="18" height="12" rx="3" fill="#5b21b6" />
        <polygon points="38,38 40,44 32,38" fill="#5b21b6" />
        <rect
          x="19"
          y="16"
          width="10"
          height="8"
          rx="2"
          fill="#a78bfa"
          opacity="0.6"
          stroke="#7c3aed"
          strokeWidth="1.5"
          strokeDasharray="2 1"
        />
        <line
          x1="21"
          y1="19"
          x2="27"
          y2="19"
          stroke="#7c3aed"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="21"
          y1="22"
          x2="25"
          y2="22"
          stroke="#7c3aed"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    "Daily Speaking Streak": (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#ffedd5" />
        <path
          d="M24 6 C24 6 14 18 14 26 C14 32 18.5 37 24 37 C29.5 37 34 32 34 26 C34 18 24 6 24 6 Z"
          fill="#f97316"
        />
        <path
          d="M24 37 C24 37 18 30 20 24 C21 20 24 22 24 28 C24 22 27 18 28 22 C30 28 24 37 24 37 Z"
          fill="#fbbf24"
        />
        <circle cx="36" cy="10" r="5" fill="#ea580c" />
        <text
          x="36"
          y="14"
          textAnchor="middle"
          fontSize="7"
          fill="white"
          fontWeight="bold"
        >
          🔥
        </text>
      </svg>
    ),
    "Timed Speaking Challenge": (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#e0f2fe" />
        <circle
          cx="24"
          cy="26"
          r="14"
          fill="none"
          stroke="#0284c7"
          strokeWidth="3"
        />
        <circle cx="24" cy="26" r="10" fill="#0284c7" opacity="0.15" />
        <line
          x1="24"
          y1="26"
          x2="24"
          y2="16"
          stroke="#0284c7"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="24"
          y1="26"
          x2="32"
          y2="26"
          stroke="#0369a1"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect x="20" y="8" width="8" height="3" rx="1.5" fill="#0284c7" />
        <line
          x1="12"
          y1="14"
          x2="15"
          y2="17"
          stroke="#0284c7"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="36"
          y1="14"
          x2="33"
          y2="17"
          stroke="#0284c7"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="24" cy="26" r="2.5" fill="#0284c7" />
      </svg>
    ),
    "Word of the Day": (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#f0fdf4" />
        <circle cx="24" cy="18" r="10" fill="#fbbf24" opacity="0.9" />
        <path
          d="M24 8 L26 14 L32 14 L27.5 17.5 L29.5 23.5 L24 20 L18.5 23.5 L20.5 17.5 L16 14 L22 14 Z"
          fill="#f59e0b"
        />
        <rect x="12" y="30" width="24" height="3" rx="1.5" fill="#65a30d" />
        <rect
          x="15"
          y="35"
          width="18"
          height="2.5"
          rx="1.2"
          fill="#65a30d"
          opacity="0.7"
        />
        <path
          d="M18 30 L24 22 L30 30"
          stroke="#84cc16"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    ),
    "Weekly Voice Journal": (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#fce7f3" />
        <rect x="10" y="12" width="28" height="26" rx="4" fill="#db2777" />
        <rect x="14" y="16" width="8" height="10" rx="4" fill="#fce7f3" />
        <path
          d="M10 24 Q10 28 14 28 L14 26"
          stroke="#fce7f3"
          strokeWidth="0"
          fill="none"
        />
        <line
          x1="26"
          y1="17"
          x2="34"
          y2="17"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
        <line
          x1="26"
          y1="21"
          x2="32"
          y2="21"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <line
          x1="26"
          y1="25"
          x2="34"
          y2="25"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M8 28 Q8 34 14 34"
          stroke="#db2777"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="36" cy="36" r="6" fill="#be185d" />
        <polygon points="34,33 34,39 39,36" fill="white" />
      </svg>
    ),
    "AI Content Discovery": (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#ede9fe" />
        <circle
          cx="20"
          cy="20"
          r="9"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="3"
        />
        <line
          x1="27"
          y1="27"
          x2="36"
          y2="36"
          stroke="#7c3aed"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="20" cy="20" r="5" fill="#a78bfa" opacity="0.4" />
        <circle cx="18" cy="18" r="2" fill="#7c3aed" opacity="0.6" />
        <circle cx="36" cy="10" r="6" fill="#5b21b6" />
        <text
          x="36"
          y="14"
          textAnchor="middle"
          fontSize="8"
          fill="white"
          fontWeight="bold"
        >
          AI
        </text>
      </svg>
    ),
  };

  const fallback = (
    <svg
      width={s}
      height={s}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" fill="#f1f5f9" />
      <text x="24" y="30" textAnchor="middle" fontSize="20">
        📚
      </text>
    </svg>
  );

  return icons[moduleName] ?? fallback;
}

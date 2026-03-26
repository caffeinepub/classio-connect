import { useEffect, useState } from "react";

export type CharacterType = "boy" | "girl" | "teacher";

interface Props {
  type: CharacterType;
  isSpeaking?: boolean;
}

export function AnimatedCharacter({ type, isSpeaking = false }: Props) {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (isSpeaking) {
      setBounce(true);
      const t = setTimeout(() => setBounce(false), 2000);
      return () => clearTimeout(t);
    }
  }, [isSpeaking]);

  const containerStyle: React.CSSProperties = {
    animation: bounce
      ? "speak 0.3s ease-in-out 6 alternate"
      : "float 3s ease-in-out infinite",
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes speak {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.03); }
          100% { transform: translateY(0) scale(1); }
        }
      `}</style>
      <div style={containerStyle} className="flex flex-col items-center">
        {type === "boy" && <BoyCharacter speaking={bounce} />}
        {type === "girl" && <GirlCharacter speaking={bounce} />}
        {type === "teacher" && <TeacherCharacter speaking={bounce} />}
      </div>
    </>
  );
}

function BoyCharacter({ speaking }: { speaking: boolean }) {
  return (
    <svg
      width="120"
      height="180"
      viewBox="0 0 120 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Boy character</title>
      {/* Shadow */}
      <ellipse cx="60" cy="174" rx="28" ry="5" fill="#e2e8f0" />
      {/* Legs */}
      <rect x="42" y="130" width="14" height="40" rx="7" fill="#1e3a5f" />
      <rect x="64" y="130" width="14" height="40" rx="7" fill="#1e3a5f" />
      {/* Shoes */}
      <ellipse cx="49" cy="170" rx="10" ry="6" fill="#1a1a2e" />
      <ellipse cx="71" cy="170" rx="10" ry="6" fill="#1a1a2e" />
      {/* Body */}
      <rect x="35" y="85" width="50" height="50" rx="14" fill="#3b82f6" />
      {/* Shirt collar */}
      <path
        d="M52 85 L60 95 L68 85"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      {/* Arms */}
      <rect x="14" y="88" width="22" height="12" rx="6" fill="#3b82f6" />
      <rect x="84" y="88" width="22" height="12" rx="6" fill="#3b82f6" />
      {/* Hands */}
      <circle cx="11" cy="94" r="8" fill="#fcd3a1" />
      <circle cx="109" cy="94" r="8" fill="#fcd3a1" />
      {/* Neck */}
      <rect x="52" y="72" width="16" height="16" rx="5" fill="#fcd3a1" />
      {/* Head */}
      <ellipse cx="60" cy="52" rx="26" ry="28" fill="#fcd3a1" />
      {/* Hair */}
      <ellipse cx="60" cy="26" rx="26" ry="14" fill="#5a3e1b" />
      <rect x="34" y="26" width="6" height="18" rx="3" fill="#5a3e1b" />
      <rect x="80" y="26" width="6" height="18" rx="3" fill="#5a3e1b" />
      {/* Eyes */}
      <circle cx="50" cy="50" r="5" fill="white" />
      <circle cx="70" cy="50" r="5" fill="white" />
      <circle cx="51" cy="51" r="3" fill="#2d1b00" />
      <circle cx="71" cy="51" r="3" fill="#2d1b00" />
      <circle cx="52" cy="50" r="1" fill="white" />
      <circle cx="72" cy="50" r="1" fill="white" />
      {/* Eyebrows */}
      <path
        d="M45 44 Q50 41 55 44"
        stroke="#5a3e1b"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M65 44 Q70 41 75 44"
        stroke="#5a3e1b"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Mouth */}
      {speaking ? (
        <ellipse cx="60" cy="64" rx="8" ry="5" fill="#c0392b" />
      ) : (
        <path
          d="M52 63 Q60 70 68 63"
          stroke="#c0392b"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {/* Nose */}
      <circle cx="60" cy="57" r="2" fill="#e8a87c" />
      {/* Ears */}
      <ellipse cx="34" cy="52" rx="5" ry="7" fill="#fcd3a1" />
      <ellipse cx="86" cy="52" rx="5" ry="7" fill="#fcd3a1" />
    </svg>
  );
}

function GirlCharacter({ speaking }: { speaking: boolean }) {
  return (
    <svg
      width="120"
      height="180"
      viewBox="0 0 120 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Girl character</title>
      {/* Shadow */}
      <ellipse cx="60" cy="174" rx="28" ry="5" fill="#e2e8f0" />
      {/* Dress/Skirt */}
      <path d="M35 130 L25 170 L95 170 L85 130 Z" fill="#a855f7" />
      {/* Dress top */}
      <rect x="35" y="85" width="50" height="50" rx="14" fill="#c084fc" />
      {/* Dress detail */}
      <path
        d="M45 95 L60 100 L75 95"
        stroke="#ffffff80"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Arms */}
      <rect x="14" y="88" width="22" height="12" rx="6" fill="#c084fc" />
      <rect x="84" y="88" width="22" height="12" rx="6" fill="#c084fc" />
      {/* Hands */}
      <circle cx="11" cy="94" r="8" fill="#fcd3a1" />
      <circle cx="109" cy="94" r="8" fill="#fcd3a1" />
      {/* Shoes */}
      <ellipse cx="42" cy="170" rx="10" ry="5" fill="#ec4899" />
      <ellipse cx="78" cy="170" rx="10" ry="5" fill="#ec4899" />
      {/* Neck */}
      <rect x="52" y="72" width="16" height="16" rx="5" fill="#fcd3a1" />
      {/* Head */}
      <ellipse cx="60" cy="52" rx="26" ry="28" fill="#fcd3a1" />
      {/* Hair body */}
      <ellipse cx="60" cy="26" rx="27" ry="16" fill="#8b4513" />
      <rect x="84" y="26" width="8" height="45" rx="4" fill="#8b4513" />
      {/* Ponytail tie */}
      <circle cx="88" cy="42" r="5" fill="#ec4899" />
      {/* Hair sides */}
      <rect x="33" y="26" width="8" height="22" rx="4" fill="#8b4513" />
      {/* Ears */}
      <ellipse cx="34" cy="52" rx="5" ry="7" fill="#fcd3a1" />
      <ellipse cx="86" cy="52" rx="5" ry="7" fill="#fcd3a1" />
      {/* Eyes */}
      <circle cx="50" cy="50" r="5" fill="white" />
      <circle cx="70" cy="50" r="5" fill="white" />
      <circle cx="51" cy="51" r="3" fill="#2d1b00" />
      <circle cx="71" cy="51" r="3" fill="#2d1b00" />
      <circle cx="52" cy="50" r="1" fill="white" />
      <circle cx="72" cy="50" r="1" fill="white" />
      {/* Eyelashes */}
      <path
        d="M46 45 L47 42 M50 44 L50 41 M54 45 L55 42"
        stroke="#5a3e1b"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M66 45 L67 42 M70 44 L70 41 M74 45 L75 42"
        stroke="#5a3e1b"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Eyebrows */}
      <path
        d="M45 44 Q50 42 55 44"
        stroke="#5a3e1b"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M65 44 Q70 42 75 44"
        stroke="#5a3e1b"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Cheeks */}
      <circle cx="43" cy="61" r="6" fill="#ffb3c1" opacity="0.5" />
      <circle cx="77" cy="61" r="6" fill="#ffb3c1" opacity="0.5" />
      {/* Nose */}
      <circle cx="60" cy="57" r="2" fill="#e8a87c" />
      {/* Mouth */}
      {speaking ? (
        <ellipse cx="60" cy="64" rx="7" ry="5" fill="#c0392b" />
      ) : (
        <path
          d="M53 63 Q60 71 67 63"
          stroke="#c0392b"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function TeacherCharacter({ speaking }: { speaking: boolean }) {
  return (
    <svg
      width="120"
      height="180"
      viewBox="0 0 120 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Teacher character</title>
      {/* Shadow */}
      <ellipse cx="60" cy="174" rx="28" ry="5" fill="#e2e8f0" />
      {/* Legs */}
      <rect x="42" y="130" width="14" height="42" rx="7" fill="#374151" />
      <rect x="64" y="130" width="14" height="42" rx="7" fill="#374151" />
      {/* Shoes */}
      <ellipse cx="49" cy="172" rx="11" ry="6" fill="#111827" />
      <ellipse cx="71" cy="172" rx="11" ry="6" fill="#111827" />
      {/* Blazer body */}
      <rect x="33" y="84" width="54" height="50" rx="14" fill="#1e40af" />
      {/* Shirt under collar */}
      <rect x="50" y="84" width="20" height="20" rx="4" fill="#f8fafc" />
      {/* Tie */}
      <path d="M58 86 L62 86 L64 102 L60 108 L56 102 Z" fill="#dc2626" />
      {/* Blazer lapels */}
      <path
        d="M50 84 L35 100 L50 104"
        fill="#1e40af"
        stroke="#1d3480"
        strokeWidth="1"
      />
      <path
        d="M70 84 L85 100 L70 104"
        fill="#1e40af"
        stroke="#1d3480"
        strokeWidth="1"
      />
      {/* Book in left hand */}
      <rect x="4" y="88" width="20" height="26" rx="3" fill="#f59e0b" />
      <rect x="5" y="89" width="2" height="24" rx="1" fill="#d97706" />
      <line x1="9" y1="93" x2="22" y2="93" stroke="#92400e" strokeWidth="1" />
      <line x1="9" y1="97" x2="22" y2="97" stroke="#92400e" strokeWidth="1" />
      <line x1="9" y1="101" x2="22" y2="101" stroke="#92400e" strokeWidth="1" />
      {/* Arms */}
      <rect x="13" y="88" width="22" height="12" rx="6" fill="#1e40af" />
      <rect x="85" y="88" width="22" height="12" rx="6" fill="#1e40af" />
      {/* Hands */}
      <circle cx="24" cy="100" r="7" fill="#fcd3a1" />
      <circle cx="109" cy="94" r="8" fill="#fcd3a1" />
      {/* Neck */}
      <rect x="52" y="72" width="16" height="16" rx="5" fill="#fcd3a1" />
      {/* Head */}
      <ellipse cx="60" cy="50" rx="26" ry="28" fill="#fcd3a1" />
      {/* Hair */}
      <ellipse cx="60" cy="26" rx="26" ry="12" fill="#2c1810" />
      <rect x="34" y="26" width="6" height="14" rx="3" fill="#2c1810" />
      <rect x="80" y="26" width="6" height="14" rx="3" fill="#2c1810" />
      {/* Ears */}
      <ellipse cx="34" cy="50" rx="5" ry="7" fill="#fcd3a1" />
      <ellipse cx="86" cy="50" rx="5" ry="7" fill="#fcd3a1" />
      {/* Glasses */}
      <circle
        cx="49"
        cy="50"
        r="9"
        fill="none"
        stroke="#374151"
        strokeWidth="2"
      />
      <circle
        cx="71"
        cy="50"
        r="9"
        fill="none"
        stroke="#374151"
        strokeWidth="2"
      />
      <line x1="58" y1="50" x2="62" y2="50" stroke="#374151" strokeWidth="2" />
      <line x1="30" y1="48" x2="40" y2="50" stroke="#374151" strokeWidth="2" />
      <line x1="80" y1="50" x2="90" y2="48" stroke="#374151" strokeWidth="2" />
      {/* Eyes */}
      <circle cx="49" cy="51" r="3" fill="#2d1b00" />
      <circle cx="71" cy="51" r="3" fill="#2d1b00" />
      <circle cx="50" cy="50" r="1" fill="white" />
      <circle cx="72" cy="50" r="1" fill="white" />
      {/* Eyebrows */}
      <path
        d="M43 41 Q49 38 55 41"
        stroke="#2c1810"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M65 41 Q71 38 77 41"
        stroke="#2c1810"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Nose */}
      <circle cx="60" cy="55" r="2" fill="#e8a87c" />
      {/* Mouth */}
      {speaking ? (
        <ellipse cx="60" cy="64" rx="8" ry="5" fill="#c0392b" />
      ) : (
        <path
          d="M52 63 Q60 68 68 63"
          stroke="#c0392b"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

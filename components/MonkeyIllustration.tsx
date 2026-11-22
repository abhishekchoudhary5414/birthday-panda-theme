import React from 'react';

interface MonkeyProps {
  size?: number | string;
  className?: string;
  showPartyHat?: boolean;
  showBanana?: boolean;
}

export const MonkeyIllustration: React.FC<MonkeyProps> = ({
  size = 260,
  className = '',
  showPartyHat = true,
  showBanana = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
    >
      {/* Ground Shadow */}
      <ellipse cx="100" cy="184" rx="55" ry="10" fill="rgba(41, 75, 53, 0.12)" />

      {/* ================= 1. SWIRLING PREHENSILE TAIL ================= */}
      <path
        d="M128 152 C155 152 178 135 174 105 C170 78 142 80 144 98 C146 112 162 110 162 102"
        stroke="#825127"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* ================= 2. SITTING FEET ================= */}
      <ellipse cx="68" cy="174" rx="14" ry="10" fill="#825127" />
      <ellipse cx="66" cy="173" rx="9" ry="6" fill="#FADCB8" />
      <circle cx="58" cy="170" r="2.5" fill="#825127" />
      <circle cx="62" cy="166" r="2.5" fill="#825127" />
      <circle cx="68" cy="165" r="2.5" fill="#825127" />

      <ellipse cx="132" cy="174" rx="14" ry="10" fill="#825127" />
      <ellipse cx="134" cy="173" rx="9" ry="6" fill="#FADCB8" />
      <circle cx="142" cy="170" r="2.5" fill="#825127" />
      <circle cx="138" cy="166" r="2.5" fill="#825127" />
      <circle cx="132" cy="165" r="2.5" fill="#825127" />

      {/* ================= 3. BODY & TUMMY ================= */}
      <path
        d="M68 126 C60 152 64 175 82 178 C92 179 108 179 118 178 C136 175 140 152 132 126 Z"
        fill="#825127"
      />
      <ellipse cx="100" cy="150" rx="24" ry="20" fill="#FADCB8" />
      <circle cx="100" cy="155" r="1.5" fill="#DFA87A" />

      {/* ================= 4. BIG ROUND EARS ================= */}
      <circle cx="56" cy="94" r="18" fill="#825127" />
      <circle cx="56" cy="94" r="12" fill="#FADCB8" />

      <circle cx="144" cy="94" r="18" fill="#825127" />
      <circle cx="144" cy="94" r="12" fill="#FADCB8" />

      {/* ================= 5. HEAD ================= */}
      <circle cx="100" cy="95" r="36" fill="#825127" />

      {/* Top Hair Tufts */}
      <path d="M96 59 Q100 52 104 59 Q100 55 96 59 Z" fill="#6A3F1B" />
      <path d="M100 60 Q105 50 108 59 Q104 54 100 60 Z" fill="#6A3F1B" />

      {/* Heart-Shaped Peachy Facial Mask */}
      <path
        d="M100 82 C94 72 74 72 74 88 C74 105 84 125 100 126 C116 125 126 105 126 88 C126 72 106 72 100 82 Z"
        fill="#FADCB8"
      />

      {/* Sparkly Big Eyes */}
      <circle cx="88" cy="90" r="5.5" fill="#1B3824" />
      <circle cx="86.5" cy="88.5" r="2.2" fill="#FFFFFF" />
      <circle cx="89.5" cy="92" r="1" fill="#FFFFFF" />

      <circle cx="112" cy="90" r="5.5" fill="#1B3824" />
      <circle cx="110.5" cy="88.5" r="2.2" fill="#FFFFFF" />
      <circle cx="113.5" cy="92" r="1" fill="#FFFFFF" />

      {/* Rosy Cheeks */}
      <ellipse cx="78" cy="100" rx="6" ry="4" fill="#FFAAA6" opacity="0.85" />
      <ellipse cx="122" cy="100" rx="6" ry="4" fill="#FFAAA6" opacity="0.85" />

      {/* Nostrils & Smile */}
      <ellipse cx="97" cy="101" rx="1.5" ry="1.8" fill="#825127" />
      <ellipse cx="103" cy="101" rx="1.5" ry="1.8" fill="#825127" />
      <path d="M90 106 Q100 118 110 106" stroke="#825127" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M96 111 Q100 116 104 111 Z" fill="#FF8080" />

      {/* ================= 6. ARMS & BANANA ================= */}
      <path d="M74 130 C64 135 68 152 82 148" stroke="#825127" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="84" cy="147" r="4.5" fill="#FADCB8" />

      <path d="M126 130 C136 135 132 152 118 148" stroke="#825127" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="116" cy="147" r="4.5" fill="#FADCB8" />

      {showBanana && (
        <g id="bananaGroup">
          <path
            d="M78 142 C92 136 114 138 126 150 C114 154 94 152 78 142 Z"
            fill="#FACC15"
            stroke="#CA8A04"
            strokeWidth="1.2"
          />
          <path d="M78 142 L73 140 L75 144 Z" fill="#65A30D" />
          <path d="M126 150 L129 152 L127 154 Z" fill="#854D0E" />
          <path d="M82 143 Q102 140 122 149" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* ================= 7. CELEBRATION PARTY HAT ================= */}
      {showPartyHat && (
        <g id="partyHat" transform="translate(93, 28)">
          <polygon points="12,0 1,24 23,24" fill="#D9B66F" />
          <path d="M4 17 L20 17 L21 21 L3 21 Z" fill="#1B3824" opacity="0.85" />
          <path d="M6 10 L18 10 L19 14 L5 14 Z" fill="#E67E22" opacity="0.9" />
          <circle cx="12" cy="0" r="3.5" fill="#FF5E5E" />
        </g>
      )}
    </svg>
  );
};

export default MonkeyIllustration;

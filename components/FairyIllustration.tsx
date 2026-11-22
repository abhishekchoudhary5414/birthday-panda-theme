import React from 'react';

interface FairyProps {
  size?: number | string;
  className?: string;
  showWings?: boolean;
  showWand?: boolean;
}

export const FairyIllustration: React.FC<FairyProps> = ({
  size = 320,
  className = '',
  showWings = true,
  showWand = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 340 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Iridescent Wing Gradients */}
        <linearGradient id="fairyWingGrad1" x1="170" y1="60" x2="60" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#A7F3D0" stopOpacity="0.65" />
          <stop offset="80%" stopColor="#BAE6FD" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.4" />
        </linearGradient>

        <linearGradient id="fairyWingGrad2" x1="170" y1="60" x2="280" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#FBCFE8" stopOpacity="0.65" />
          <stop offset="80%" stopColor="#DDD6FE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.4" />
        </linearGradient>

        {/* Petal Dress Gradient */}
        <linearGradient id="fairyDressGrad" x1="170" y1="180" x2="170" y2="340" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#789B63" />
          <stop offset="60%" stopColor="#4B7746" />
          <stop offset="100%" stopColor="#2D5329" />
        </linearGradient>

        {/* Fairy Hair Gradient */}
        <linearGradient id="fairyHairGrad" x1="170" y1="40" x2="170" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="40%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        {/* Soft Skin Gradient */}
        <linearGradient id="fairySkinGrad" x1="170" y1="70" x2="170" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF8F2" />
          <stop offset="100%" stopColor="#FED7AA" />
        </linearGradient>

        {/* Star Wand Gold Glow */}
        <linearGradient id="goldWandGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
      </defs>

      {/* ================= 1. GOSSAMER FAIRY WINGS ================= */}
      {showWings && (
        <g id="fairyWings">
          <path
            d="M165 170 C130 110 50 60 40 100 C32 135 90 180 162 185 Z"
            fill="url(#fairyWingGrad1)"
            stroke="#A7F3D0"
            strokeWidth="1.5"
          />
          <path d="M52 108 C80 125 125 155 162 175" stroke="#FFFFFF" strokeWidth="1.2" fill="none" opacity="0.8" />
          <path
            d="M162 185 C120 185 68 215 75 245 C80 265 120 250 165 205 Z"
            fill="url(#fairyWingGrad1)"
            stroke="#A7F3D0"
            strokeWidth="1.2"
          />

          <path
            d="M175 170 C210 110 290 60 300 100 C308 135 250 180 178 185 Z"
            fill="url(#fairyWingGrad2)"
            stroke="#FBCFE8"
            strokeWidth="1.5"
          />
          <path d="M288 108 C260 125 215 155 178 175" stroke="#FFFFFF" strokeWidth="1.2" fill="none" opacity="0.8" />
          <path
            d="M178 185 C220 185 272 215 265 245 C260 265 220 250 175 205 Z"
            fill="url(#fairyWingGrad2)"
            stroke="#FBCFE8"
            strokeWidth="1.2"
          />

          <circle cx="58" cy="112" r="2" fill="#FFFFFF" />
          <circle cx="282" cy="112" r="2" fill="#FFFFFF" />
        </g>
      )}

      {/* ================= 2. FLOWING HAIR (BACK) ================= */}
      <g id="backHair">
        <path
          d="M132 115 C105 145 95 195 115 245 C120 255 132 250 128 240 C112 200 120 155 142 125 Z"
          fill="url(#fairyHairGrad)"
        />
        <path
          d="M208 115 C235 145 245 195 225 245 C220 255 208 250 212 240 C228 200 220 155 198 125 Z"
          fill="url(#fairyHairGrad)"
        />
      </g>

      {/* ================= 3. LEGS & BALLET SLIPPERS ================= */}
      <g id="fairyLegs">
        <path d="M158 285 C154 315 150 345 148 375 C148 382 154 382 156 376 L166 315 Z" fill="url(#fairySkinGrad)" />
        <path d="M148 368 L156 368 L154 378 L147 376 Z" fill="#D9B66F" />
        <path d="M149 350 L158 358 M158 350 L150 358" stroke="#D9B66F" strokeWidth="1" />

        <path d="M174 285 C180 310 190 335 186 365 C184 372 190 372 192 366 C198 335 188 310 182 285 Z" fill="url(#fairySkinGrad)" />
        <path d="M185 358 L192 358 L190 368 L184 366 Z" fill="#D9B66F" />
        <path d="M183 342 L191 350 M191 342 L183 350" stroke="#D9B66F" strokeWidth="1" />
      </g>

      {/* ================= 4. BODY & LAYERED PETAL DRESS ================= */}
      <g id="fairyDress">
        <path d="M155 150 L155 195 C155 205 185 205 185 195 L185 150 Z" fill="url(#fairySkinGrad)" />

        {/* Leaf Bodice */}
        <path
          d="M154 175 C162 165 170 174 170 174 C170 174 178 165 186 175 L184 215 C170 218 160 215 154 215 Z"
          fill="url(#fairyDressGrad)"
        />
        <circle cx="170" cy="184" r="2.5" fill="#D9B66F" />

        {/* Overlapping Petal Skirt */}
        <path
          d="M154 212 C140 240 135 270 152 285 C162 272 168 250 170 230 C172 250 178 272 188 285 C205 270 200 240 186 212 Z"
          fill="url(#fairyDressGrad)"
          stroke="#294B35"
          strokeWidth="1"
        />
        <path d="M146 250 C140 270 148 290 162 295 C158 280 155 265 154 250 Z" fill="#F472B6" opacity="0.85" />
        <path d="M194 250 C200 270 192 290 178 295 C182 280 185 265 186 250 Z" fill="#F472B6" opacity="0.85" />
      </g>

      {/* ================= 5. REDESIGNED ADORABLE ROUND FACE ================= */}
      <g id="roundFairyFace">
        {/* Perfectly Rounded Head with Chubby Cheeks (Kawaii/Chibi Style) */}
        <ellipse
          cx="170"
          cy="116"
          rx="36"
          ry="34"
          fill="url(#fairySkinGrad)"
          stroke="#EA580C"
          strokeWidth="0.8"
        />

        {/* Pointed Soft Elven Ears */}
        <path
          d="M135 116 C124 114 112 104 108 100 C114 110 124 120 136 126 Z"
          fill="#FED7AA"
          stroke="#EA580C"
          strokeWidth="0.8"
        />
        <path
          d="M205 116 C216 114 228 104 232 100 C226 110 216 120 204 126 Z"
          fill="#FED7AA"
          stroke="#EA580C"
          strokeWidth="0.8"
        />

        {/* Chubby Pink Blushing Cheeks */}
        <ellipse cx="150" cy="128" rx="8.5" ry="6" fill="#FDA4AF" opacity="0.85" />
        <ellipse cx="190" cy="128" rx="8.5" ry="6" fill="#FDA4AF" opacity="0.85" />

        {/* Sweet Dainty Smile */}
        <path d="M164 135 Q170 142 176 135" stroke="#BE185D" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M166 136 Q170 141 174 136 Z" fill="#F43F5E" />

        {/* Tiny Button Nose */}
        <circle cx="170" cy="125" r="1.5" fill="#F97316" opacity="0.6" />

        {/* Big Expressive Anime/Chibi Emerald Eyes */}
        <g>
          <ellipse cx="153" cy="114" rx="7" ry="9" fill="#047857" />
          <ellipse cx="153" cy="115" rx="5" ry="6.5" fill="#064E3B" />
          <circle cx="151" cy="110.5" r="2.8" fill="#FFFFFF" />
          <circle cx="155.5" cy="117" r="1.4" fill="#FFFFFF" />
          <circle cx="151" cy="118" r="0.8" fill="#FFFFFF" />
          <path d="M144 108 Q153 103 162 108" stroke="#1F2937" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M145 105 L141 101" stroke="#1F2937" strokeWidth="1.6" strokeLinecap="round" />
        </g>

        <g>
          <ellipse cx="187" cy="114" rx="7" ry="9" fill="#047857" />
          <ellipse cx="187" cy="115" rx="5" ry="6.5" fill="#064E3B" />
          <circle cx="185" cy="110.5" r="2.8" fill="#FFFFFF" />
          <circle cx="189.5" cy="117" r="1.4" fill="#FFFFFF" />
          <circle cx="185" cy="118" r="0.8" fill="#FFFFFF" />
          <path d="M178 108 Q187 103 196 108" stroke="#1F2937" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M195 105 L199 101" stroke="#1F2937" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      </g>

      {/* ================= 6. FRONT HAIR & WILDFLOWER WREATH ================= */}
      <g id="fairyHairCrown">
        <circle cx="170" cy="66" r="18" fill="url(#fairyHairGrad)" />

        {/* Soft Rounded Fringe Bangs */}
        <path
          d="M136 108 C140 85 160 82 170 82 C180 82 200 85 204 108 C195 98 185 96 170 100 C155 96 145 98 136 108 Z"
          fill="url(#fairyHairGrad)"
        />

        {/* Side Curls Framing Round Cheeks */}
        <path d="M137 108 C132 120 134 135 138 142 C135 134 134 122 138 112 Z" fill="#B45309" />
        <path d="M203 108 C208 120 206 135 202 142 C205 134 206 122 202 112 Z" fill="#B45309" />

        {/* Wildflower Wreath */}
        <g id="flowerWreath">
          <path d="M142 84 Q170 76 198 84" stroke="#4B7746" strokeWidth="2.2" fill="none" />
          <circle cx="152" cy="80" r="4.5" fill="#F472B6" />
          <circle cx="152" cy="80" r="1.8" fill="#FEF08A" />
          <circle cx="170" cy="76" r="5" fill="#FACC15" />
          <circle cx="170" cy="76" r="2" fill="#FFFFFF" />
          <circle cx="188" cy="80" r="4.5" fill="#38BDF8" />
          <circle cx="188" cy="80" r="1.8" fill="#FEF08A" />
        </g>
      </g>

      {/* ================= 7. ARMS & GLOWING STAR WAND ================= */}
      <path d="M154 185 C140 195 130 215 132 232 C135 235 142 232 140 226 C138 212 148 198 156 195 Z" fill="url(#fairySkinGrad)" />
      <path d="M184 185 C205 180 230 165 252 145 L256 150 C235 174 208 194 184 195 Z" fill="url(#fairySkinGrad)" />
      <ellipse cx="254" cy="146" rx="4" ry="3" fill="#FED7AA" />

      {showWand && (
        <g id="magicWand">
          <line x1="240" y1="165" x2="275" y2="130" stroke="#D9B66F" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M278 120 L281 126 L288 128 L282 133 L284 140 L278 135 L272 140 L274 133 L268 128 L275 126 Z"
            fill="url(#goldWandGrad)"
            stroke="#B45309"
            strokeWidth="0.8"
          />
          <circle cx="278" cy="130" r="2.5" fill="#FFFFFF" />

          {/* Pixie Dust */}
          <path
            d="M278 130 C270 155 245 175 220 185 C200 192 185 205 190 220 C194 230 210 232 222 226"
            stroke="#FDE047"
            strokeWidth="1.8"
            strokeDasharray="3 3"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
          <circle cx="265" cy="150" r="2" fill="#FACC15" />
          <circle cx="242" cy="172" r="1.5" fill="#FFFFFF" />
          <circle cx="215" cy="190" r="2.2" fill="#F472B6" />
          <circle cx="192" cy="212" r="1.8" fill="#38BDF8" />
          <circle cx="218" cy="226" r="2.5" fill="#FACC15" />
        </g>
      )}
    </svg>
  );
};

export default FairyIllustration;


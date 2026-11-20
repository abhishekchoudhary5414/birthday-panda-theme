import styles from './PandaIllustrations.module.css';
import React from 'react';

// Sitting Party Panda with Birthday Hat & Bamboo Cupcake
export const PartyPanda: React.FC<{ size?: number; className?: string }> = ({ size = 200, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ overflow: 'visible' }}
  >
    {/* Shadow */}
    <ellipse cx="100" cy="182" rx="65" ry="12" fill="rgba(41, 75, 53, 0.12)" />

    {/* Ears */}
    <circle cx="58" cy="62" r="22" fill="#252525" />
    <circle cx="58" cy="62" r="12" fill="#3D3D3D" />
    <circle cx="142" cy="62" r="22" fill="#252525" />
    <circle cx="142" cy="62" r="12" fill="#3D3D3D" />

    {/* Body */}
    <path
      d="M55 125 C45 155 52 178 75 180 C90 181 110 181 125 180 C148 178 155 155 145 125 Z"
      fill="#252525"
    />
    {/* White Tummy */}
    <ellipse cx="100" cy="150" rx="32" ry="24" fill="#FFFFFF" />

    {/* Paws */}
    <ellipse cx="62" cy="172" rx="16" ry="12" fill="#252525" />
    <ellipse cx="62" cy="170" rx="8" ry="6" fill="#4A4A4A" opacity="0.3" />
    <ellipse cx="138" cy="172" rx="16" ry="12" fill="#252525" />
    <ellipse cx="138" cy="170" rx="8" ry="6" fill="#4A4A4A" opacity="0.3" />

    {/* Arms holding cupcake/bamboo */}
    <ellipse cx="65" cy="138" rx="16" ry="14" transform="rotate(-15 65 138)" fill="#252525" />
    <ellipse cx="135" cy="138" rx="16" ry="14" transform="rotate(15 135 138)" fill="#252525" />

    {/* Bamboo Shoot / Birthday Cupcake */}
    <g transform="translate(85, 122)">
      {/* Cupcake Base */}
      <path d="M5 20 L25 20 L22 35 L8 35 Z" fill="#D9B66F" />
      <path d="M3 20 Q15 10 27 20 Q20 8 15 8 Q10 8 3 20 Z" fill="#A3C58E" />
      {/* Candle */}
      <rect x="13.5" y="2" width="3" height="8" rx="1.5" fill="#FFE5E5" />
      {/* Flame */}
      <path d="M15 -4 Q18 0 15 3 Q12 0 15 -4 Z" fill="#FFB84D" />
      <circle cx="15" cy="0" r="2" fill="#FF4D4D" />
    </g>

    {/* Head */}
    <ellipse cx="100" cy="98" rx="48" ry="42" fill="#FFFFFF" />
    <path
      d="M54 96 C54 75 74 60 100 60 C126 60 146 75 146 96 C146 117 126 136 100 136 C74 136 54 117 54 96 Z"
      fill="#FFFFFF"
    />

    {/* Eye Patches */}
    <ellipse cx="78" cy="96" rx="15" ry="18" transform="rotate(-15 78 96)" fill="#252525" />
    <ellipse cx="122" cy="96" rx="15" ry="18" transform="rotate(15 122 96)" fill="#252525" />

    {/* Eyes */}
    <circle cx="80" cy="95" r="5" fill="#FFFFFF" />
    <circle cx="81" cy="94" r="2.5" fill="#252525" />
    <circle cx="82" cy="93" r="1.2" fill="#FFFFFF" />

    <circle cx="120" cy="95" r="5" fill="#FFFFFF" />
    <circle cx="119" cy="94" r="2.5" fill="#252525" />
    <circle cx="118" cy="93" r="1.2" fill="#FFFFFF" />

    {/* Rosy Cheeks */}
    <ellipse cx="66" cy="112" rx="9" ry="6" fill="#FFB8B8" opacity="0.65" />
    <ellipse cx="134" cy="112" rx="9" ry="6" fill="#FFB8B8" opacity="0.65" />

    {/* Nose and Mouth */}
    <ellipse cx="100" cy="107" rx="6" ry="4" fill="#252525" />
    <path
      d="M96 113 Q100 117 104 113"
      stroke="#252525"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M97 114 Q100 121 103 114"
      fill="#FF8E8E"
      stroke="#252525"
      strokeWidth="1"
    />

    {/* Birthday Party Hat */}
    <g transform="translate(100, 58) rotate(8)">
      <polygon points="0,-48 -18,0 18,0" fill="#789B63" />
      {/* Stripes on Hat */}
      <path d="M-6 -16 L6 -16 L9 -8 L-9 -8 Z" fill="#D9B66F" />
      <path d="M-12 -32 L-2 -32 L1 -24 L-11 -24 Z" fill="#FFE5E5" />
      {/* Pom-pom */}
      <circle cx="0" cy="-48" r="6" fill="#D9B66F" />
      {/* Hat brim */}
      <ellipse cx="0" cy="0" rx="20" ry="4" fill="#5D8049" />
    </g>
  </svg>
);

// Happy Waving Panda
export const WavingPanda: React.FC<{ size?: number; className?: string }> = ({ size = 180, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 180 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Shadow */}
    <ellipse cx="90" cy="168" rx="55" ry="10" fill="rgba(41, 75, 53, 0.12)" />

    {/* Ears */}
    <circle cx="50" cy="52" r="19" fill="#252525" />
    <circle cx="130" cy="52" r="19" fill="#252525" />

    {/* Body */}
    <ellipse cx="90" cy="135" rx="42" ry="32" fill="#252525" />
    <ellipse cx="90" cy="135" rx="28" ry="22" fill="#FFFFFF" />

    {/* Left Paw Down */}
    <ellipse cx="50" cy="135" rx="14" ry="12" fill="#252525" />

    {/* Right Paw Waving Up */}
    <g style={{ transformOrigin: '125px 125px', animation: 'gentleSway 2s ease-in-out infinite' }}>
      <ellipse cx="135" cy="100" rx="14" ry="18" transform="rotate(30 135 100)" fill="#252525" />
      <circle cx="138" cy="92" r="5" fill="#4A4A4A" opacity="0.3" />
      {/* Floating Sparkles around paw */}
      <path d="M152 75 L154 82 L161 84 L154 86 L152 93 L150 86 L143 84 L150 82 Z" fill="#D9B66F" />
    </g>

    {/* Feet */}
    <ellipse cx="65" cy="160" rx="15" ry="10" fill="#252525" />
    <ellipse cx="115" cy="160" rx="15" ry="10" fill="#252525" />

    {/* Head */}
    <ellipse cx="90" cy="85" rx="44" ry="38" fill="#FFFFFF" />

    {/* Eyes & Patches */}
    <ellipse cx="70" cy="82" rx="13" ry="16" transform="rotate(-15 70 82)" fill="#252525" />
    <ellipse cx="110" cy="82" rx="13" ry="16" transform="rotate(15 110 82)" fill="#252525" />

    {/* Happy curved eyes (smiling closed or sparkling) */}
    <circle cx="72" cy="82" r="4.5" fill="#FFFFFF" />
    <circle cx="73" cy="81" r="2" fill="#252525" />
    <circle cx="74" cy="80" r="1" fill="#FFFFFF" />

    <circle cx="108" cy="82" r="4.5" fill="#FFFFFF" />
    <circle cx="107" cy="81" r="2" fill="#252525" />
    <circle cx="106" cy="80" r="1" fill="#FFFFFF" />

    {/* Cheeks */}
    <circle cx="58" cy="96" r="7" fill="#FFB8B8" opacity="0.7" />
    <circle cx="122" cy="96" r="7" fill="#FFB8B8" opacity="0.7" />

    {/* Nose & Smile */}
    <ellipse cx="90" cy="92" rx="5" ry="3.5" fill="#252525" />
    <path
      d="M86 98 Q90 103 94 98"
      stroke="#252525"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// Peeking Panda (over card or header)
export const PeekingPanda: React.FC<{ size?: number; className?: string }> = ({ size = 150, className = '' }) => (
  <svg
    width={size}
    height={size * 0.65}
    viewBox="0 0 150 98"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Ears */}
    <circle cx="36" cy="30" r="17" fill="#252525" />
    <circle cx="114" cy="30" r="17" fill="#252525" />

    {/* Head */}
    <path
      d="M26 68 C22 45 45 22 75 22 C105 22 128 45 124 68 C122 80 115 88 115 98 L35 98 C35 88 28 80 26 68 Z"
      fill="#FFFFFF"
    />

    {/* Eye Patches */}
    <ellipse cx="56" cy="52" rx="12" ry="14" transform="rotate(-15 56 52)" fill="#252525" />
    <ellipse cx="94" cy="52" rx="12" ry="14" transform="rotate(15 94 52)" fill="#252525" />

    {/* Eyes */}
    <circle cx="57" cy="51" r="4" fill="#FFFFFF" />
    <circle cx="58" cy="50" r="2" fill="#252525" />
    <circle cx="59" cy="49" r="1" fill="#FFFFFF" />

    <circle cx="93" cy="51" r="4" fill="#FFFFFF" />
    <circle cx="92" cy="50" r="2" fill="#252525" />
    <circle cx="91" cy="49" r="1" fill="#FFFFFF" />

    {/* Cheeks */}
    <ellipse cx="45" cy="64" rx="7" ry="5" fill="#FFB8B8" opacity="0.6" />
    <ellipse cx="105" cy="64" rx="7" ry="5" fill="#FFB8B8" opacity="0.6" />

    {/* Nose */}
    <ellipse cx="75" cy="62" rx="5" ry="3.5" fill="#252525" />

    {/* Paws resting on top of card edge */}
    <ellipse cx="44" cy="92" rx="13" ry="9" fill="#252525" />
    <ellipse cx="106" cy="92" rx="13" ry="9" fill="#252525" />
  </svg>
);

// Floating Panda with Colorful Balloons
export const FloatingPandaWithBalloons: React.FC<{ size?: number; className?: string }> = ({ size = 220, className = '' }) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 200 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ overflow: 'visible' }}
  >
    {/* Balloons */}
    <g>
      {/* Balloon 1: Bamboo Green */}
      <path
        d="M60 40 C60 18 78 5 98 5 C118 5 136 18 136 40 C136 60 115 75 98 75 C81 75 60 60 60 40 Z"
        fill="#789B63"
      />
      <polygon points="98,75 94,80 102,80" fill="#5D8049" />
      <path d="M75 25 Q82 16 92 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

      {/* Balloon 2: Pastel Gold */}
      <path
        d="M105 50 C105 30 120 18 138 18 C156 18 171 30 171 50 C171 68 152 82 138 82 C124 82 105 68 105 50 Z"
        fill="#D9B66F"
      />
      <polygon points="138,82 134,86 142,86" fill="#B38D40" />
      <path d="M120 35 Q126 27 134 29" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* Balloon 3: Blush Pink */}
      <path
        d="M25 55 C25 35 40 22 58 22 C76 22 91 35 91 55 C91 73 72 87 58 87 C44 87 25 73 25 55 Z"
        fill="#FFB8B8"
      />
      <polygon points="58,87 54,91 62,91" fill="#E69595" />
      <path d="M38 40 Q44 32 52 34" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* Balloon Strings converging to paw */}
      <path d="M98 80 Q105 120 100 155" stroke="#8E9E93" strokeWidth="1.2" strokeDasharray="2 2" fill="none" />
      <path d="M138 86 Q125 125 102 155" stroke="#8E9E93" strokeWidth="1.2" strokeDasharray="2 2" fill="none" />
      <path d="M58 91 Q80 125 98 155" stroke="#8E9E93" strokeWidth="1.2" strokeDasharray="2 2" fill="none" />
    </g>

    {/* Little Panda Holding Strings */}
    <g transform="translate(10, 30)">
      {/* Ears */}
      <circle cx="68" cy="142" r="14" fill="#252525" />
      <circle cx="122" cy="142" r="14" fill="#252525" />

      {/* Body */}
      <ellipse cx="95" cy="200" rx="30" ry="24" fill="#252525" />
      <ellipse cx="95" cy="200" rx="18" ry="16" fill="#FFFFFF" />

      {/* Legs dangling */}
      <ellipse cx="78" cy="222" rx="10" ry="14" transform="rotate(15 78 222)" fill="#252525" />
      <ellipse cx="112" cy="222" rx="10" ry="14" transform="rotate(-15 112 222)" fill="#252525" />

      {/* Arm holding balloon strings */}
      <ellipse cx="92" cy="155" rx="10" ry="14" transform="rotate(-20 92 155)" fill="#252525" />
      <ellipse cx="70" cy="188" rx="8" ry="12" fill="#252525" />

      {/* Head */}
      <ellipse cx="95" cy="165" rx="32" ry="28" fill="#FFFFFF" />

      {/* Eye Patches */}
      <ellipse cx="82" cy="164" rx="9" ry="11" transform="rotate(-15 82 164)" fill="#252525" />
      <ellipse cx="108" cy="164" rx="9" ry="11" transform="rotate(15 108 164)" fill="#252525" />

      {/* Big joyful eyes */}
      <circle cx="83" cy="163" r="3.5" fill="#FFFFFF" />
      <circle cx="84" cy="162" r="1.5" fill="#252525" />
      <circle cx="107" cy="163" r="3.5" fill="#FFFFFF" />
      <circle cx="106" cy="162" r="1.5" fill="#252525" />

      {/* Cheeks */}
      <circle cx="74" cy="172" r="5" fill="#FFB8B8" opacity="0.7" />
      <circle cx="116" cy="172" r="5" fill="#FFB8B8" opacity="0.7" />

      {/* Nose & Smile */}
      <ellipse cx="95" cy="170" rx="3.5" ry="2.5" fill="#252525" />
      <path d="M92 174 Q95 178 98 174" stroke="#252525" strokeWidth="2" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

// Decorative Bamboo Stalk & Leaves
export const BambooStalkDecoration: React.FC<{ height?: number; className?: string }> = ({ height = 300, className = '' }) => (
  <svg
    width="50"
    height={height}
    viewBox="0 0 50 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="none"
  >
    {/* Segment 1 */}
    <rect x="20" y="210" width="10" height="85" rx="4" fill="#789B63" />
    <rect x="18" y="208" width="14" height="4" rx="2" fill="#5D8049" />
    <path d="M23 210 L23 295" stroke="#A3C58E" strokeWidth="2" opacity="0.6" />

    {/* Segment 2 */}
    <rect x="20" y="110" width="10" height="95" rx="4" fill="#789B63" />
    <rect x="18" y="108" width="14" height="4" rx="2" fill="#5D8049" />
    <path d="M23 110 L23 205" stroke="#A3C58E" strokeWidth="2" opacity="0.6" />

    {/* Segment 3 */}
    <rect x="20" y="10" width="10" height="95" rx="4" fill="#789B63" />
    <rect x="18" y="8" width="14" height="4" rx="2" fill="#5D8049" />
    <path d="M23 10 L23 105" stroke="#A3C58E" strokeWidth="2" opacity="0.6" />

    {/* Leaves branching out */}
    {/* Left leaf at node 2 */}
    <path
      d="M18 208 C5 195 2 175 1 160 C12 170 20 185 20 205 Z"
      fill="#5D8049"
    />
    <path
      d="M18 208 C8 205 3 195 0 185 C8 190 15 200 19 207 Z"
      fill="#789B63"
    />

    {/* Right leaf at node 1 */}
    <path
      d="M32 108 C45 95 48 75 49 60 C38 70 30 85 30 105 Z"
      fill="#789B63"
    />
    <path
      d="M32 108 C42 105 47 95 50 85 C42 90 35 100 31 107 Z"
      fill="#5D8049"
    />
  </svg>
);

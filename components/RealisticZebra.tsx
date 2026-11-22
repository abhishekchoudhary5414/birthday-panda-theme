import React from 'react';

interface RealisticZebraProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const RealisticZebra: React.FC<RealisticZebraProps> = ({
  width = '100%',
  height = 'auto',
  className = '',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 580 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Shading gradients for muscular depth */}
        <linearGradient id="realZebraUnderShade" x1="280" y1="200" x2="280" y2="350" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        <linearGradient id="realZebraHoof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#78716C" />
          <stop offset="60%" stopColor="#44403C" />
          <stop offset="100%" stopColor="#1C1917" />
        </linearGradient>
      </defs>

      {/* ================= 1. REAR FAR LEGS (BACKGROUND) ================= */}
      <g id="farHindLeg">
        <path
          d="M175 240 L165 310 L168 375 L174 382 L164 384 L158 372 L154 315 L160 250 Z"
          fill="#D5DFE8"
        />
        <path d="M156 322 L166 320 L167 325 L157 327 Z" fill="#292D32" />
        <path d="M158 335 L168 333 L169 338 L159 340 Z" fill="#292D32" />
        <path d="M160 348 L170 346 L171 351 L161 353 Z" fill="#292D32" />
        <path d="M163 362 L172 360 L173 365 L164 367 Z" fill="#292D32" />
        <path d="M164 372 L174 374 L178 386 L160 386 Z" fill="url(#realZebraHoof)" />
      </g>

      <g id="farForeLeg">
        <path
          d="M338 245 L328 305 L318 368 L324 375 L314 377 L308 365 L316 300 L325 245 Z"
          fill="#D5DFE8"
        />
        <path d="M316 312 L326 314 L325 318 L315 316 Z" fill="#292D32" />
        <path d="M314 326 L324 328 L323 332 L313 330 Z" fill="#292D32" />
        <path d="M312 342 L322 344 L321 348 L311 346 Z" fill="#292D32" />
        <path d="M310 356 L320 358 L319 362 L309 360 Z" fill="#292D32" />
        <path d="M312 368 L324 370 L322 382 L306 382 Z" fill="url(#realZebraHoof)" />
      </g>

      {/* ================= 2. TAIL WITH LONG BLACK TUFT ================= */}
      <g id="realisticTail">
        <path
          d="M112 165 C102 188 96 230 102 270 L108 270 C102 232 108 190 118 168 Z"
          fill="#FFFFFF"
        />
        <path d="M112 182 L116 182 L115 186 L111 186 Z" fill="#181A1B" />
        <path d="M109 198 L113 198 L112 202 L108 202 Z" fill="#181A1B" />
        <path d="M107 214 L111 214 L110 218 L106 218 Z" fill="#181A1B" />
        <path d="M105 230 L109 230 L108 234 L104 234 Z" fill="#181A1B" />
        <path d="M104 246 L108 246 L107 250 L103 250 Z" fill="#181A1B" />

        <path
          d="M102 268 C96 295 94 330 98 350 C102 332 106 310 108 270 Z"
          fill="#181A1B"
        />
        <path d="M98 300 C92 325 94 345 96 352 C98 340 102 320 104 300 Z" fill="#2C3033" />
      </g>

      {/* ================= 3. EQUINE TORSO & HINDQUARTERS ================= */}
      <path
        d="M115 168 C110 145 130 125 165 120 C205 116 260 132 305 135 C335 136 360 128 370 122 L385 158 C370 185 365 210 368 248 L342 258 C320 252 270 262 215 258 C180 256 160 250 148 242 L138 238 C120 220 114 195 115 168 Z"
        fill="url(#realZebraUnderShade)"
      />

      <path
        d="M210 258 C250 262 300 256 345 248 C342 258 318 266 280 266 C235 266 215 260 210 258 Z"
        fill="#CBD5E1"
        opacity="0.8"
      />

      {/* ================= 4. FOREGROUND LEGS ================= */}
      {/* Near Hind Leg */}
      <g id="nearHindLeg">
        <path
          d="M142 242 C134 265 132 305 124 350 L126 385 L138 385 L146 350 C154 315 165 285 174 250 Z"
          fill="#FFFFFF"
        />
        <path d="M140 248 L170 254 L168 260 L138 254 Z" fill="#181A1B" />
        <path d="M136 262 L166 268 L164 274 L134 268 Z" fill="#181A1B" />
        <path d="M134 276 L164 282 L162 288 L132 282 Z" fill="#181A1B" />
        <path d="M132 290 L160 295 L158 301 L130 296 Z" fill="#181A1B" />
        <path d="M130 304 L156 308 L154 314 L128 310 Z" fill="#181A1B" />
        <path d="M128 318 L152 322 L150 327 L127 323 Z" fill="#181A1B" />
        <path d="M127 330 L148 333 L147 338 L126 335 Z" fill="#181A1B" />
        <path d="M125 342 L144 344 L143 349 L124 347 Z" fill="#181A1B" />
        <path d="M124 354 L140 356 L139 361 L124 359 Z" fill="#181A1B" />
        <path d="M124 365 L138 367 L137 371 L124 369 Z" fill="#181A1B" />
        <path d="M125 375 L138 376 L137 380 L125 379 Z" fill="#181A1B" />
        <path d="M125 382 L140 382 L145 398 L122 398 Z" fill="url(#realZebraHoof)" />
      </g>

      {/* Near Foreleg */}
      <g id="nearForeLeg">
        <path
          d="M365 240 C360 270 352 320 342 360 L342 385 L355 385 L364 355 C374 315 380 270 380 240 Z"
          fill="#FFFFFF"
        />
        {/* Carpal Patch */}
        <ellipse cx="355" cy="285" rx="8" ry="12" fill="#252A2D" />

        <path d="M362 250 L378 248 L379 254 L361 256 Z" fill="#181A1B" />
        <path d="M358 264 L376 262 L377 267 L357 269 Z" fill="#181A1B" />
        <path d="M354 278 L374 276 L375 281 L353 283 Z" fill="#181A1B" />
        <path d="M350 298 L370 296 L371 301 L349 303 Z" fill="#181A1B" />
        <path d="M347 312 L368 310 L369 315 L346 317 Z" fill="#181A1B" />
        <path d="M345 326 L366 324 L367 329 L344 331 Z" fill="#181A1B" />
        <path d="M344 340 L364 338 L364 343 L343 345 Z" fill="#181A1B" />
        <path d="M343 354 L360 352 L360 357 L342 359 Z" fill="#181A1B" />
        <path d="M342 366 L356 364 L356 369 L342 371 Z" fill="#181A1B" />
        <path d="M342 375 L354 374 L354 378 L342 379 Z" fill="#181A1B" />
        <path d="M341 382 L356 382 L362 396 L338 396 Z" fill="url(#realZebraHoof)" />
      </g>

      {/* ================= 5. AUTHENTIC BODY STRIPES ================= */}
      <g id="torsoStripes">
        <path d="M125 150 C155 140 210 152 248 190 L242 198 C205 162 155 150 122 158 Z" fill="#181A1B" />
        <path d="M135 135 C175 128 235 148 268 205 L260 212 C228 158 172 138 132 144 Z" fill="#181A1B" />
        <path d="M152 124 C195 120 252 148 284 225 L276 230 C245 158 190 130 148 132 Z" fill="#181A1B" />
        <path d="M174 120 C215 122 268 158 296 242 L288 245 C260 168 210 132 170 128 Z" fill="#181A1B" />

        <path d="M198 122 C236 130 282 176 308 250 L300 252 C275 182 230 138 194 130 Z" fill="#181A1B" />
        <path d="M224 125 C255 136 295 190 318 254 L310 255 C288 195 250 144 220 133 Z" fill="#181A1B" />
        <path d="M248 128 C275 142 308 200 328 255 L320 256 C300 205 270 150 244 136 Z" fill="#181A1B" />
        <path d="M272 130 C294 148 322 208 338 255 L330 255 C315 210 288 156 268 138 Z" fill="#181A1B" />

        <path d="M294 132 C312 155 334 212 346 254 L340 254 C328 214 306 160 290 139 Z" fill="#181A1B" />
        <path d="M316 134 C330 160 346 215 354 252 L348 252 C340 216 324 165 312 140 Z" fill="#181A1B" />
        <path d="M336 133 C348 162 358 212 362 248 L356 248 C352 214 342 166 332 139 Z" fill="#181A1B" />
        <path d="M354 130 C364 165 370 210 372 244 L366 244 C364 212 358 168 350 135 Z" fill="#181A1B" />
      </g>

      {/* ================= 6. NECK & CREST MANE ================= */}
      <path
        d="M365 125 C370 100 380 68 405 52 L425 65 C435 90 440 120 440 150 L385 158 Z"
        fill="#FFFFFF"
      />

      {/* Stiff Upright Brush Mane */}
      <g id="uprightMane">
        <path
          d="M362 126 L365 105 L372 108 L374 88 L382 92 L385 75 L394 80 L398 62 L408 68 L414 52 L422 62 L420 78 L415 75 L412 95 L405 92 L400 112 L392 110 L386 128 L376 126 Z"
          fill="#181A1B"
        />
        <path d="M374 102 L378 94 L382 104 Z" fill="#FFFFFF" />
        <path d="M386 86 L390 78 L394 88 Z" fill="#FFFFFF" />
        <path d="M398 72 L402 65 L406 75 Z" fill="#FFFFFF" />
        <path d="M410 60 L414 54 L418 64 Z" fill="#FFFFFF" />
      </g>

      {/* Neck Stripes */}
      <path d="M370 122 L405 132 L402 138 L368 128 Z" fill="#181A1B" />
      <path d="M376 108 L415 122 L412 128 L373 114 Z" fill="#181A1B" />
      <path d="M384 94 L424 112 L421 118 L381 100 Z" fill="#181A1B" />
      <path d="M392 80 L430 100 L427 106 L389 86 Z" fill="#181A1B" />
      <path d="M402 68 L435 90 L432 96 L399 74 Z" fill="#181A1B" />

      {/* ================= 7. THREE-QUARTER FACIAL HEAD ================= */}
      <g id="realisticHead3Quarter">
        <path
          d="M418 58 C410 75 412 110 416 138 C418 152 422 170 428 178 C434 186 448 186 454 176 C458 168 460 148 458 128 C456 95 448 65 435 56 C426 50 422 52 418 58 Z"
          fill="#FFFFFF"
          stroke="#D1D5DB"
          strokeWidth="0.8"
        />

        {/* Velvety Snout */}
        <path
          d="M416 142 C418 160 424 178 430 184 C436 190 448 188 454 180 C458 172 458 155 456 138 C445 146 426 148 416 142 Z"
          fill="#262322"
        />
        <path
          d="M422 144 C432 146 444 144 452 140 C454 150 450 162 438 162 C428 162 424 152 422 144 Z"
          fill="#574636"
          opacity="0.85"
        />

        {/* Nostrils */}
        <ellipse cx="427" cy="168" rx="2.5" ry="4" transform="rotate(-10 427 168)" fill="#0F0F10" />
        <ellipse cx="448" cy="166" rx="2.5" ry="4" transform="rotate(10 448 166)" fill="#0F0F10" />
        <path d="M432 182 Q438 186 444 182" stroke="#121110" strokeWidth="1.8" fill="none" />

        {/* Facial Stripes */}
        <path d="M422 72 L432 95 L430 98 L420 74 Z" fill="#181A1B" />
        <path d="M434 68 L438 98 L436 100 L432 70 Z" fill="#181A1B" />
        <path d="M444 72 L442 96 L440 98 L442 74 Z" fill="#181A1B" />

        <path d="M422 102 L436 108 L448 102 L447 106 L436 112 L423 106 Z" fill="#181A1B" />
        <path d="M420 114 L436 120 L450 114 L449 118 L436 124 L421 118 Z" fill="#181A1B" />
        <path d="M418 126 L436 132 L454 126 L453 130 L436 136 L419 130 Z" fill="#181A1B" />

        {/* Left Eye */}
        <ellipse cx="417" cy="88" rx="4.5" ry="5.5" transform="rotate(-15 417 88)" fill="#0F0F10" />
        <circle cx="416" cy="86" r="1.5" fill="#FFFFFF" />
        <circle cx="418" cy="89" r="0.7" fill="#854D0E" />

        {/* Right Eye */}
        <ellipse cx="452" cy="86" rx="4.5" ry="5.5" transform="rotate(15 452 86)" fill="#0F0F10" />
        <circle cx="451" cy="84" r="1.5" fill="#FFFFFF" />
        <circle cx="453" cy="87" r="0.7" fill="#854D0E" />

        {/* Left Ear */}
        <path
          d="M414 54 C408 34 414 18 424 16 C430 15 434 26 430 46 Z"
          fill="#FFFFFF"
          stroke="#181A1B"
          strokeWidth="1"
        />
        <path d="M418 20 C422 16 426 16 428 22 C424 24 420 22 418 20 Z" fill="#181A1B" />
        <path d="M417 44 C415 32 418 24 423 22 C425 24 424 35 422 46 Z" fill="#85796E" opacity="0.6" />

        {/* Right Ear */}
        <path
          d="M440 50 C444 30 452 16 462 16 C468 16 468 28 460 48 Z"
          fill="#FFFFFF"
          stroke="#181A1B"
          strokeWidth="1"
        />
        <path d="M455 18 C460 16 464 16 466 22 C462 24 458 22 455 18 Z" fill="#181A1B" />
        <path d="M454 44 C456 32 458 24 461 22 C462 24 460 35 457 46 Z" fill="#85796E" opacity="0.6" />
      </g>
    </svg>
  );
};

export default RealisticZebra;

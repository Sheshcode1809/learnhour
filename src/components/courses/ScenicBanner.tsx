import React from 'react';

export function ScenicBanner({ height = 'h-48 md:h-64' }: { height?: string }) {
  return (
    <div className={`w-full ${height} relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#F2ECE1] via-[#E8E1D3] to-[#DDD4C1] select-none border border-sand-border/80 shadow-2xs`}>
      {/* Sun/Aura */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-to-b from-amber-100/60 to-orange-100/10 blur-xl pointer-events-none" />

      {/* Birds */}
      <svg className="absolute top-8 left-1/3 w-16 h-8 text-charcoal-400/40" viewBox="0 0 60 25" fill="none">
        <path d="M5 12 Q 10 5 15 12 Q 20 5 25 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M35 8 Q 39 3 43 8 Q 47 3 51 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>

      {/* SVG Scenery: Distant Mountains, Hills, Lake, Pines */}
      <svg
        className="absolute inset-0 w-full h-full object-cover"
        viewBox="0 0 1000 320"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft distant mountains */}
        <path
          d="M0 240 L120 160 L280 230 L450 140 L620 220 L800 130 L950 210 L1000 180 L1000 320 L0 320 Z"
          fill="#CFC3AF"
          opacity="0.45"
        />
        {/* Mid-range warm hills */}
        <path
          d="M0 260 C180 200 320 240 500 190 C680 150 820 220 1000 170 L1000 320 L0 320 Z"
          fill="#BFB099"
          opacity="0.5"
        />
        {/* Calm lake / water body */}
        <path
          d="M0 245 C250 235 750 235 1000 245 L1000 275 C750 280 250 280 0 275 Z"
          fill="#8BA6A9"
          opacity="0.35"
        />
        {/* Lake reflections */}
        <path
          d="M200 255 H300 M550 260 H700 M400 268 H480"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          opacity="0.4"
          strokeLinecap="round"
        />
        {/* Foreground rolling green meadow */}
        <path
          d="M0 270 C220 255 450 265 680 255 C820 248 920 260 1000 250 L1000 320 L0 320 Z"
          fill="#4A6B43"
        />
        <path
          d="M0 285 C280 275 600 285 1000 270 L1000 320 L0 320 Z"
          fill="#3B5935"
        />

        {/* Clustered Pine Trees Left */}
        <g fill="#2D4728">
          <polygon points="120,270 112,285 128,285" />
          <polygon points="120,260 114,272 126,272" />
          <polygon points="135,268 126,286 144,286" />
          <polygon points="135,256 128,270 142,270" />
          <polygon points="150,272 143,288 157,288" />
        </g>

        {/* Clustered Pine Trees Right */}
        <g fill="#253D21">
          <polygon points="820,265 810,285 830,285" />
          <polygon points="820,250 812,268 828,268" />
          <polygon points="838,260 828,282 848,282" />
          <polygon points="838,245 830,262 846,262" />
          <polygon points="856,266 847,286 865,286" />
          <polygon points="856,252 849,268 863,268" />
        </g>
      </svg>
    </div>
  );
}


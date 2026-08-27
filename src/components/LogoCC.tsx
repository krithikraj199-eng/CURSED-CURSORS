import React from 'react';

interface LogoCCProps {
  size?: number;
  className?: string;
  withGlow?: boolean;
}

export const LogoCC: React.FC<LogoCCProps> = ({
  size = 36,
  className = '',
  withGlow = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md transition-transform duration-200 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="logo-cc-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="logo-cc-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E0E7FF" />
          </linearGradient>
          {withGlow && (
            <filter id="logo-cc-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#8B5CF6" floodOpacity="0.45" />
            </filter>
          )}
        </defs>

        {/* 3D Outer Rounded Badge Base */}
        <rect
          x="3"
          y="3"
          width="58"
          height="58"
          rx="16"
          fill="#090d16"
          stroke="url(#logo-cc-gradient-1)"
          strokeWidth="2.5"
        />

        {/* 3D Top Bevel Specular Highlight */}
        <rect x="5" y="5" width="54" height="26" rx="13" fill="white" fillOpacity="0.06" />

        {/* 3D Bottom Accent Lip */}
        <rect x="6" y="53" width="52" height="5" rx="2.5" fill="#06B6D4" fillOpacity="0.35" />

        {/* First 'C' (Left) */}
        <path
          d="M 31 15 L 18 15 C 12 15 7.5 19.5 7.5 25.5 L 7.5 38.5 C 7.5 44.5 12 49 18 49 L 31 49 L 31 41.5 L 18 41.5 C 16 41.5 14.5 40 14.5 38 L 14.5 26 C 14.5 24 16 22.5 18 22.5 L 31 22.5 Z"
          fill="url(#logo-cc-gradient-1)"
        />

        {/* Second 'C' (Right) */}
        <path
          d="M 56.5 15 L 43.5 15 C 37.5 15 33 19.5 33 25.5 L 33 38.5 C 33 44.5 37.5 49 43.5 49 L 56.5 49 L 56.5 41.5 L 43.5 41.5 C 41.5 41.5 40 40 40 38 L 40 26 C 40 24 41.5 22.5 43.5 22.5 L 56.5 22.5 Z"
          fill="url(#logo-cc-gradient-2)"
          filter={withGlow ? 'url(#logo-cc-glow)' : undefined}
        />
      </svg>
    </div>
  );
};

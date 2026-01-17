
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-full h-full" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* تدرج ذهبي معدني متطور */}
        <linearGradient id="metalGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="20%" stopColor="#eab308" />
          <stop offset="50%" stopColor="#ca8a04" />
          <stop offset="80%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>

        {/* تدرج بريق خفيف */}
        <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        
        <filter id="premiumShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      <g filter="url(#premiumShadow)">
        {/* الدائرة الخارجية (الإطار الفخم) */}
        <circle 
          cx="100" 
          cy="100" 
          r="85" 
          stroke="url(#metalGold)" 
          strokeWidth="2" 
          fill="none" 
          strokeDasharray="4 2"
        />
        <circle 
          cx="100" 
          cy="100" 
          r="78" 
          stroke="url(#metalGold)" 
          strokeWidth="6" 
          fill="none" 
        />
        
        {/* كلمة "أطياب" المركزية - تم تصغير الحجم لمظهر أكثر توازناً */}
        <text 
          x="100" 
          y="125" 
          textAnchor="middle" 
          fill="url(#metalGold)"
          style={{ 
            fontSize: '68px', 
            fontWeight: '900', 
            fontFamily: 'Cairo, sans-serif',
            filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.2))'
          }}
        >
          أطياب
        </text>

        {/* خطوط زخرفية جانبية متناسقة */}
        <path d="M45 100 H60" stroke="url(#metalGold)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <path d="M140 100 H155" stroke="url(#metalGold)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        
        {/* لمعة سريعة فوق التصميم لزيادة الفخامة */}
        <rect 
          x="30" 
          y="30" 
          width="140" 
          height="140" 
          fill="url(#shineGradient)" 
          style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
          transform="rotate(-45 100 100)"
        />
      </g>
    </svg>
  );
};

export default Logo;

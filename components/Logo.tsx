
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-full h-full" }) => {
  return (
    <img 
      src="https://8upload.com/image/e5fbfb2ab7a6dbbd/ChatGPT_Image_Jan_17__2026__05_03_49_PM.png" 
      alt="شعار أطياب" 
      className={`${className} object-cover scale-110`}
      loading="eager"
    />
  );
};

export default Logo;

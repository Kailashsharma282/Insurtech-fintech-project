'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  depth?: number; // max tilt degrees (default: 10)
  glare?: boolean;
  glowOnHover?: boolean;
  glowColor?: string; // hex or rgb
  clickable?: boolean;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  depth = 8,
  glare = true,
  glowOnHover = true,
  glowColor = 'rgba(16, 185, 129, 0.35)',
  clickable = false,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to card center (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Calculate 3D rotation angles
    const rotX = -mouseY * depth * 2;
    const rotY = mouseX * depth * 2;

    setRotateX(rotX);
    setRotateY(rotY);

    if (glare) {
      const glareX = ((e.clientX - rect.left) / width) * 100;
      const glareY = ((e.clientY - rect.top) / height) * 100;
      setGlarePos({ x: glareX, y: glareY, opacity: 0.25 });
    }
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1200px',
      }}
      className={`relative group ${clickable ? 'cursor-pointer' : ''}`}
      {...props}
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease',
          boxShadow: isHovered && glowOnHover
            ? `0 20px 35px -10px ${glowColor}, 0 0 20px 0 ${glowColor}`
            : '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        }}
        className={`w-full h-full rounded-2xl md:rounded-3xl transition-all duration-300 ${className}`}
      >
        {/* Child content with 3D perspective depth */}
        <div style={{ transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)', transition: 'transform 0.2s ease-out' }} className="w-full h-full">
          {children}
        </div>

        {/* Dynamic Specular Glare Reflection on Hover */}
        {glare && (
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none transition-opacity duration-300 overflow-hidden"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45), transparent 70%)`,
              transform: 'translateZ(30px)',
            }}
          />
        )}

        {/* Subtle Animated Glowing Border Line */}
        {glowOnHover && isHovered && (
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none border border-[#10B981]/50 transition-opacity duration-300"
            style={{
              transform: 'translateZ(10px)',
            }}
          />
        )}
      </div>
    </div>
  );
};

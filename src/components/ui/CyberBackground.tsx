'use client';

import React from 'react';

interface SimpleBackgroundProps {
  variant?: 'dark' | 'light' | 'hero';
  showParticles?: boolean;
  showGrid?: boolean;
  className?: string;
}

/**
 * Clean, simple background without animations, particles, or distracting canvas loops.
 * Prioritizes high legibility and lightweight rendering for rural & mobile access.
 */
export const CyberBackground: React.FC<SimpleBackgroundProps> = ({
  variant = 'light',
  className = '',
}) => {
  // Pure static background with high contrast and zero CPU/GPU overhead
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none -z-10 ${
        variant === 'dark' || variant === 'hero' ? 'bg-[#0B1E17]' : 'bg-[#F8FAFC]'
      } ${className}`}
    />
  );
};

export default CyberBackground;

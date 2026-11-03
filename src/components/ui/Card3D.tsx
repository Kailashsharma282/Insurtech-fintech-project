'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  glare?: boolean;
  glowOnHover?: boolean;
  glowColor?: string;
  clickable?: boolean;
}

/**
 * Simple, accessible Card component without 3D animations, glare, or motion.
 * Designed for rural/farmer accessibility with clean contrast and solid borders.
 */
export const Card3D: React.FC<CardProps> = ({
  children,
  className = '',
  depth,
  glare,
  glowOnHover,
  glowColor,
  clickable = false,
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors ${
        clickable ? 'cursor-pointer hover:border-blue-600' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card3D;

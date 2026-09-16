'use client';

import React, { useEffect, useRef } from 'react';

interface CyberBackgroundProps {
  variant?: 'dark' | 'light' | 'hero';
  showParticles?: boolean;
  showGrid?: boolean;
  className?: string;
}

export const CyberBackground: React.FC<CyberBackgroundProps> = ({
  variant = 'dark',
  showParticles = true,
  showGrid = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!showParticles || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes definition
    const particleCount = Math.min(45, Math.floor((width * height) / 22000));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
    }> = [];

    const isDark = variant === 'dark' || variant === 'hero';

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 1,
        baseAlpha: Math.random() * 0.4 + 0.2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Draw faint 3D perspective terrain lines at bottom if hero variant
      if (variant === 'hero') {
        const horizonY = height * 0.65;
        const gridColor = 'rgba(16, 185, 129, 0.06)';
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;

        // Perspective converging lines
        const vanishingX = width * 0.5;
        const count = 16;
        for (let i = -count; i <= count; i++) {
          ctx.beginPath();
          ctx.moveTo(vanishingX, horizonY);
          const targetX = vanishingX + i * (width / count) * 1.8;
          ctx.lineTo(targetX, height);
          ctx.stroke();
        }

        // Horizontal perspective lines with logarithmic spacing
        for (let j = 1; j <= 8; j++) {
          const progress = Math.pow(j / 8, 2);
          const y = horizonY + progress * (height - horizonY);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Update and draw particles & synaptic connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Screen wrap
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(52, 211, 153, ${p.baseAlpha * 0.8})`
          : `rgba(16, 185, 129, ${p.baseAlpha * 0.7})`;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * (isDark ? 0.18 : 0.12);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark
              ? `rgba(52, 211, 153, ${alpha})`
              : `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showParticles, variant]);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Dynamic 3D Ambient Blur Orbs */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-emerald-500/12 rounded-full blur-[140px] animate-pulse-slow" />
      <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[160px] animate-float-slow" />
      <div className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] bg-[#059669]/15 rounded-full blur-[150px] animate-pulse-slow" />

      {/* Cybernetic Dot & Scanline Grid Overlay */}
      {showGrid && (
        <div
          className={`absolute inset-0 ${
            variant === 'dark' || variant === 'hero' ? 'tech-grid-dark' : 'tech-grid-pattern'
          } opacity-70`}
        />
      )}

      {/* Holographic Radar Sweep Line in Hero */}
      {variant === 'hero' && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent h-48 w-full animate-scanline pointer-events-none" />
      )}

      {/* Interactive Constellation Canvas */}
      {showParticles && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      )}
    </div>
  );
};

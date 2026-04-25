'use client';

import React, { useEffect, useRef } from 'react';

export const InteractiveWaves = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    let animationFrameId: number;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const waveCount = 12;
    const points = 60;
    
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      
      const time = Date.now() * 0.001;

      for (let i = 0; i < waveCount; i++) {
        const z = i / waveCount; // Depth factor (0 to 1)
        const scale = 0.4 + (1 - z) * 0.6; // Scale waves
        const opacity = 0.1 + (1 - z) * 0.25;
        const color = `rgba(34, 197, 94, ${opacity})`;
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 * scale;

        const yBase = h * 0.2 + (z * h * 0.6); // Wider distribution

        for (let j = 0; j <= points; j++) {
          const xProgress = j / points;
          const x = xProgress * w;
          
          // Complex wavy motion
          const wave1 = Math.sin(xProgress * 5 + time + i * 0.5) * 40;
          const wave2 = Math.sin(xProgress * 10 - time * 0.5 + i) * 20;
          const offset = (wave1 + wave2) * scale;
          
          const y = yBase + offset;

          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 w-full h-full pointer-events-none"
    />
  );
};

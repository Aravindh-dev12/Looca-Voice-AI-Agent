'use client';

import React, { useEffect, useRef } from 'react';

export const AudioVisualizer = () => {
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

    const columnWidth = 14;
    const gap = 6;
    const blockHeight = 8;
    const blockGap = 4;
    const columns = Math.ceil(window.innerWidth / (columnWidth + gap));
    
    const bars = Array.from({ length: columns }, (_, i) => ({
      x: i * (columnWidth + gap),
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.03,
      baseHeight: 0.1 + Math.random() * 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      
      const time = Date.now() * 0.001;

      bars.forEach((bar, i) => {
        // Calculate height based on sine wave + random noise
        const noise = Math.sin(time * 2 + i * 0.2) * 0.1;
        const wave = Math.sin(time * bar.speed * 10 + bar.phase) * 0.2;
        const heightFactor = bar.baseHeight + noise + wave + 0.3;
        const pixelHeight = heightFactor * (h * 0.7);
        
        const numBlocks = Math.floor(pixelHeight / (blockHeight + blockGap));

        for (let j = 0; j < numBlocks; j++) {
          const y = h - (j * (blockHeight + blockGap)) - 100; // Raised from bottom to be behind text
          
          // Premium green color gradient
          const alpha = 0.8 - (j / numBlocks) * 0.6;
          ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
          
          // Draw rounded block
          if (y > 0) {
            ctx.beginPath();
            const radius = 2;
            ctx.roundRect(bar.x, y, columnWidth, blockHeight, radius);
            ctx.fill();
          }
        }
      });

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
      className="absolute inset-0 -z-10 w-full h-full opacity-60 pointer-events-none"
    />
  );
};

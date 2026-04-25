'use client';

import React, { useEffect, useRef } from 'react';

export const AudioWaves = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let w: number, h: number;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
    };

    const handleMouseLeave = () => {
      mouse.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const waves = [
      { amplitude: 50, frequency: 0.01, speed: 0.05, opacity: 0.1, lineWidth: 2 },
      { amplitude: 30, frequency: 0.02, speed: 0.03, opacity: 0.05, lineWidth: 1 },
      { amplitude: 70, frequency: 0.005, speed: 0.02, opacity: 0.08, lineWidth: 1.5 },
      { amplitude: 40, frequency: 0.015, speed: 0.04, opacity: 0.03, lineWidth: 3 },
      { amplitude: 20, frequency: 0.03, speed: 0.06, opacity: 0.06, lineWidth: 1 },
    ];

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      time += 0.01;

      waves.forEach((wave, i) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 0, 0, ${wave.opacity})`;
        ctx.lineWidth = wave.lineWidth;

        // Mouse influence
        let mouseEnergy = 0;
        if (mouse.current.active) {
          const dy = Math.abs(mouse.current.y - h / 2);
          const dx = Math.abs(mouse.current.x - w / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          mouseEnergy = Math.max(0, (500 - dist) / 500);
        }

        for (let x = 0; x < w; x++) {
          const yOffset = Math.sin(x * wave.frequency + time * wave.speed + i) * wave.amplitude;
          
          // Add extra distortion near mouse
          let mouseDistortion = 0;
          if (mouse.current.active) {
            const distToMouse = Math.abs(x - mouse.current.x);
            if (distToMouse < 200) {
              const force = (200 - distToMouse) / 200;
              mouseDistortion = Math.sin(x * 0.05 + time * 0.2) * 20 * force * mouseEnergy;
            }
          }

          const y = h / 2 + yOffset + mouseDistortion;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
};

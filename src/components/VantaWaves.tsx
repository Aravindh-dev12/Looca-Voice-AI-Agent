'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import WAVES from 'vanta/dist/vanta.waves.min';

export const VantaWaves = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).THREE = THREE;
    }
    if (!vantaEffect && vantaRef.current) {
      try {
        setVantaEffect(
          WAVES({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xd1d1d1,
            shininess: 30.00,
            waveHeight: 15.00,
            waveSpeed: 0.60,
            zoom: 1.00,
            backgroundColor: 0xffffff
          })
        );
      } catch (err) {
        console.error('Vanta initialization failed:', err);
      }
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div 
      ref={vantaRef} 
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: -1 }}
    />
  );
};

'use client';

import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const [isTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none), (pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  });
  const pathRef = useRef(null);
  const cursorRef = useRef(null);

  // Constraints and physics
  const NUM_POINTS = 24;
  const VISCOSITY = 0.45;
  const points = useRef(Array(NUM_POINTS).fill(null).map(() => ({ x: -100, y: -100 })));
  const mousePos = useRef({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isTouchDevice) return;

    document.body.classList.add('custom-cursor-enabled');

    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const handleHover = (e) => {
      const target = e.target.closest('a, button, [data-hover], input, textarea');
      setIsHovering(!!target);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', handleHover);

    let isInitialized = false;
    let frameId;

    const render = () => {
      const P = points.current;
      const targetX = mousePos.current.x;
      const targetY = mousePos.current.y;
      
      if (!isInitialized && targetX !== -100) {
        P.forEach(p => { p.x = targetX; p.y = targetY; });
        isInitialized = true;
      }

      if (isInitialized) {
        // Head smoothly follows mouse
        P[0].x += (targetX - P[0].x) * VISCOSITY;
        P[0].y += (targetY - P[0].y) * VISCOSITY;

        // Remaining points follow each other
        for (let i = 1; i < NUM_POINTS; i++) {
          P[i].x += (P[i - 1].x - P[i].x) * VISCOSITY;
          P[i].y += (P[i - 1].y - P[i].y) * VISCOSITY;
        }

        // Draw SVG string
        if (pathRef.current) {
          let d = `M ${P[0].x} ${P[0].y}`;
          for (let i = 1; i < NUM_POINTS - 1; i++) {
             // Calculate midpoints for smooth bezier curves
             const xMid = (P[i].x + P[i + 1].x) / 2;
             const yMid = (P[i].y + P[i + 1].y) / 2;
             d += ` Q ${P[i].x} ${P[i].y}, ${xMid} ${yMid}`;
          }
          // Connect to very last point
          d += ` L ${P[NUM_POINTS - 1].x} ${P[NUM_POINTS - 1].y}`;
          pathRef.current.setAttribute('d', d);
        }

        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${P[0].x}px, ${P[0].y}px) translate(-50%, -50%)`;
        }
      }

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleHover);
      cancelAnimationFrame(frameId);
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9998,
          overflow: 'visible',
        }}
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="url(#cursorGradient)"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ 
            transition: 'stroke-width 0.4s cubic-bezier(0.16, 1, 0.3, 1)', 
            strokeWidth: isHovering ? 18 : 6,
            filter: 'drop-shadow(0 0 12px rgba(255, 45, 120, 0.5))'
          }}
        />
        <defs>
          <linearGradient id="cursorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff2d78" />
            <stop offset="100%" stopColor="#ff2d78" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {/* Primary Dot */}
      <div 
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? '60px' : '10px',
          height: isHovering ? '60px' : '10px',
          borderRadius: '50%',
          backgroundColor: isHovering ? 'rgba(255, 45, 120, 0.1)' : '#fff',
          border: isHovering ? '1.5px solid rgba(255, 45, 120, 0.8)' : 'none',
          pointerEvents: 'none',
          zIndex: 9999,
          backdropFilter: isHovering ? 'blur(4px)' : 'none',
          transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s, border 0.4s',
          willChange: 'transform',
        }}
      />
    </>
  );
}

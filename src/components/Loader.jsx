'use client';

import { useEffect, useState, useRef } from 'react';
import { preloadSequenceFrames } from './sequenceCache';

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading | revealing | done
  const containerRef = useRef(null);
  const objectUrlRef = useRef('');

  useEffect(() => {
    const xhr = new XMLHttpRequest();
    let isMounted = true;
    
    // Guarantee the cinematic loader displays for at least 1500ms even on gigabit
    const minDelayPromise = new Promise(resolve => setTimeout(resolve, 800));
    
    const preloadChunksPromise = Promise.allSettled([
      import('@/components/TracksSection'),
      import('@/components/TimelineSection'),
      import('@/components/SponsorsSection'),
      import('@/components/CTASection'),
    ]);

    // Explicitly cache the hero sequence into browser memory
    const cacheVideoPromise = preloadSequenceFrames((percentComplete) => {
      if (isMounted) {
        setProgress(Math.min(99, percentComplete));
      }
    });

    // We only remove the loader when media and critical chunks are ready.
    Promise.all([cacheVideoPromise, preloadChunksPromise, minDelayPromise]).then(() => {
       if (!isMounted) return;
       setProgress(100);
       setTimeout(() => {
          if (!isMounted) return;
          setPhase('revealing');
          setTimeout(() => {
             if (!isMounted) return;
             setPhase('done');
             setTimeout(() => onComplete?.(), 600);
          }, 800);
       }, 300);
    });

    return () => {
      isMounted = false;
      xhr.abort();
      // Note: we do NOT revoke objectUrlRef here — HeroSection reuses it
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      ref={containerRef}
      style={{
        ...styles.container,
        ...(phase === 'revealing' ? styles.containerReveal : {}),
      }}
    >


      <div style={styles.content}>
        <div style={styles.logoContainer}>
          {'SHIPATHON'.split('').map((letter, i) => (
            <span
              key={i}
              style={{
                ...styles.letter,
                fontStyle: i < 4 ? 'italic' : 'normal',
                animationDelay: `${i * 80 + 200}ms`,
                ...(phase === 'revealing' ? {
                  opacity: 0,
                  transform: 'translateY(-40px) scale(1.1)',
                  transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 40}ms`,
                } : {}),
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        <div style={styles.progressContainer}>
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            />
          </div>
          <span style={styles.progressText}>{progress}%</span>
        </div>

        <div style={{ ...styles.tagline, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span>by</span>
          <div style={{ position: 'relative', display: 'inline-block', margin: '0 8px 0 6px' }}>
            <img src="/bitsnbytes.png" alt="Bits&Bytes" style={{ position: 'absolute', top: '-4px', left: '-10px', height: '6px', opacity: 0.9 }} />
            <img src="/phaser.png" alt="Phaser" style={{ height: '16px', opacity: 0.9 }} />
          </div>
          <span>Bits&Bytes' Phaser ×</span>
          <img src="/shipaccelerator_logo.jpg" alt="ShipLogo" style={{ height: '16px', borderRadius: '2px', marginLeft: '2px' }} />
          <span><em style={{ fontStyle: 'italic' }}>Ship</em></span>
        </div>
      </div>

      <style>{`
        @keyframes letterReveal {
          from {
            opacity: 0;
            transform: translateY(30px) rotateX(40deg);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    zIndex: 999,
    overflow: 'hidden',
    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  previewVideo: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.18,
    filter: 'contrast(1.1) saturate(1.05)',
    pointerEvents: 'none',
  },
  previewOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.9))',
    pointerEvents: 'none',
  },
  containerReveal: {
    opacity: 0,
    transform: 'scale(1.05)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
  },
  logoContainer: {
    display: 'flex',
    gap: '0.1em',
    perspective: '600px',
  },
  letter: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 'clamp(2.5rem, 8vw, 5rem)',
    fontWeight: 800,
    color: '#fff',
    display: 'inline-block',
    animation: 'letterReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    opacity: 0,
    letterSpacing: '-0.02em',
    textShadow: '0 0 40px rgba(255, 45, 120, 0.3)',
    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    width: '200px',
  },
  progressTrack: {
    flex: 1,
    height: '2px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #ff2d78, #e91e8c)',
    borderRadius: '999px',
    transition: 'width 0.1s ease-out',
    boxShadow: '0 0 12px rgba(255, 45, 120, 0.5)',
  },
  progressText: {
    fontFamily: "'Space Grotesk', monospace",
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: 500,
    minWidth: '32px',
    textAlign: 'right',
    letterSpacing: '0.05em',
  },
  tagline: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.25)',
    fontWeight: 400,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
  },
};

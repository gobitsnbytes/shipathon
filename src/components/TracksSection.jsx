'use client';

import { useEffect, useRef, useState } from 'react';

const TRACKS = [
  {
    id: 'ai',
    title: 'AI & Machine Learning',
    description: 'Build intelligent systems that learn, adapt, and push the boundaries of what machines can do.',
    gradient: 'linear-gradient(135deg, #ff2d78 0%, #e91e8c 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
        <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="16" cy="16" r="2" fill="currentColor"/>
        <line x1="16" y1="2" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="16" y1="24" x2="16" y2="30" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="2" y1="16" x2="8" y2="16" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="24" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'web3',
    title: 'Web3 & Blockchain',
    description: 'Decentralize the future. Build protocols, dApps, and infrastructure for the next internet.',
    gradient: 'linear-gradient(135deg, #e91e8c 0%, #c2185b 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 10L22 13.5V20.5L16 24L10 20.5V13.5L16 10Z" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="16" cy="16" r="2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'climate',
    title: 'Climate & Sustainability',
    description: 'Use technology to fight climate change. Build solutions that make a real difference for the planet.',
    gradient: 'linear-gradient(135deg, #ff6b9d 0%, #ff2d78 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 6C20.5 6 24 10 24 14C24 18 20 22 16 26C12 22 8 18 8 14C8 10 11.5 6 16 6Z" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="16" cy="14" r="3" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'health',
    title: 'Health & Biotech',
    description: 'Reimagine healthcare. From diagnostics to therapeutics, build tech that saves and improves lives.',
    gradient: 'linear-gradient(135deg, #ff8fb4 0%, #ff6b9d 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="12" y="4" width="8" height="24" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="4" y="12" width="24" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'fintech',
    title: 'Fintech & Payments',
    description: 'Reinvent money. Build financial infrastructure, payment systems, and tools for the underserved.',
    gradient: 'linear-gradient(135deg, #c2185b 0%, #ff2d78 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 12C12 10 14 8 17 8C20 8 22 10 22 12C22 14 20 15 17 15C14 15 12 16 12 18C12 20 14 22 17 22C20 22 22 20 22 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="17" y1="5" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="17" y1="22" x2="17" y2="25" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'open',
    title: 'Open Innovation',
    description: 'No constraints. Build anything that excites you. The wildest ideas win.',
    gradient: 'linear-gradient(135deg, #ff2d78 0%, #ff00ff 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 2L20 12L30 14L22 22L24 32L16 27L8 32L10 22L2 14L12 12L16 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function TracksSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) rotateX(0deg) scale(1)';
            entry.target.style.filter = 'blur(0)';
          }
        });
      },
      { threshold: 0.03, rootMargin: '0px 0px -40px 0px' }
    );

    cardsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="tracks" ref={sectionRef} style={styles.section}>
      {/* Background elements */}
      <div style={styles.gridBg} />

      <div style={styles.inner}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.label}>
            <span style={styles.labelDot} />
            Tracks
          </span>
          <h2 style={styles.title}>
            Choose Your <span style={styles.accent}>Arena</span>
          </h2>
          <p style={styles.subtitle}>
            Six tracks. Infinite possibilities. Pick the challenge that ignites your passion.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="tracks-grid" style={styles.grid}>
          {TRACKS.map((track, i) => (
            <div
              key={track.id}
              className="track-card"
              ref={(el) => (cardsRef.current[i] = el)}
              style={{
                ...styles.card,
                opacity: 0,
                transform: 'translateY(60px) rotateX(12deg) scale(0.95)',
                filter: 'blur(6px)',
                transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
                borderColor: hoveredCard === i ? 'rgba(255, 45, 120, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Glow on hover */}
              <div
                style={{
                  ...styles.cardGlow,
                  background: track.gradient,
                  opacity: hoveredCard === i ? 0.06 : 0,
                }}
              />

              {/* Top accent line */}
              <div
                style={{
                  ...styles.cardAccent,
                  background: track.gradient,
                  opacity: hoveredCard === i ? 1 : 0.3,
                }}
              />

              {/* Icon */}
              <div
                style={{
                  ...styles.iconContainer,
                  color: hoveredCard === i ? '#ff2d78' : 'rgba(255, 255, 255, 0.4)',
                }}
              >
                {track.icon}
              </div>

              <h3 style={styles.cardTitle}>{track.title}</h3>
              <p style={styles.cardDescription}>{track.description}</p>

              {/* Arrow */}
              <div
                style={{
                  ...styles.arrow,
                  opacity: hoveredCard === i ? 1 : 0,
                  transform: hoveredCard === i ? 'translateX(0)' : 'translateX(-8px)',
                }}
              >
                →
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #tracks { padding: 6rem 1.25rem !important; }
          #tracks .tracks-grid { grid-template-columns: repeat(2, 1fr) !important; }
          #tracks .track-card { padding: 1.5rem 1.25rem !important; }
        }
        @media (max-width: 600px) {
          #tracks .tracks-grid { grid-template-columns: 1fr !important; }
          #tracks .track-card { min-height: 220px; }
        }
      `}</style>
    </section>
  );
}

const styles = {
  section: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8rem 2rem',
    overflow: 'hidden',
    background: '#000',
  },
  gridBg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255, 45, 120, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 45, 120, 0.02) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    zIndex: 0,
    maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
    WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
  },
  inner: {
    position: 'relative',
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  label: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: '#ff2d78',
    marginBottom: '1.5rem',
    padding: '0.4rem 1rem',
    borderRadius: '999px',
    border: '1px solid rgba(255, 45, 120, 0.2)',
    background: 'rgba(255, 45, 120, 0.05)',
  },
  labelDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: '#ff2d78',
    boxShadow: '0 0 6px rgba(255, 45, 120, 0.8)',
    display: 'inline-block',
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 'clamp(2.2rem, 5vw, 4rem)',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    marginBottom: '1rem',
    marginTop: '1.5rem',
  },
  accent: {
    background: 'linear-gradient(135deg, #ff2d78, #e91e8c, #ff6b9d)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '1rem',
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.45)',
    maxWidth: '480px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.25rem',
  },
  card: {
    position: 'relative',
    padding: '2rem 1.75rem',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    cursor: 'none',
    overflow: 'hidden',
    perspective: '600px',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  cardGlow: {
    position: 'absolute',
    inset: 0,
    transition: 'opacity 0.5s ease',
    pointerEvents: 'none',
    filter: 'blur(40px)',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: '1.5rem',
    right: '1.5rem',
    height: '2px',
    borderRadius: '0 0 4px 4px',
    transition: 'opacity 0.4s ease',
  },
  iconContainer: {
    marginBottom: '1.25rem',
    transition: 'color 0.3s ease',
  },
  cardTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '0.6rem',
    letterSpacing: '-0.01em',
  },
  cardDescription: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.82rem',
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.4)',
    lineHeight: 1.6,
  },
  arrow: {
    position: 'absolute',
    bottom: '1.5rem',
    right: '1.5rem',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '1.2rem',
    color: '#ff2d78',
    transition: 'all 0.3s ease',
  },
};

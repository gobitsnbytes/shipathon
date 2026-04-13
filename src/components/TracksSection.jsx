'use client';

import { useEffect, useRef, useState } from 'react';

const TRACKS = [
  // --- AI/SOFTWARE TRACKS ---
  {
    id: 'ai-agents',
    title: 'Agentic Orchestration',
    description: 'Build systems where multiple AI agents coordinate complex tasks. Design foundational frameworks for interaction, autonomy, and trustworthy supervision.',
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
    id: 'ai-edge',
    title: 'Edge & Ubiquitous AI',
    description: 'Focus on lightweight AI models running entirely on-device or in low-connectivity environments. Push the boundaries of compilers, quantization, and offline AI.',
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
    id: 'ai-gen',
    title: 'Generative AI for Real Problems',
    description: 'Build end-to-end generative pipelines that produce tangible utility. Solve concrete challenges rather than just creating superficial visual demos.',
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
    id: 'ai-multi',
    title: 'Multimodal & Multilingual AI',
    description: 'Develop systems that understand diverse inputs—vision, audio, and regional languages together. Create "Everything Speaks" foundational models.',
    gradient: 'linear-gradient(135deg, #ff8fb4 0%, #ff6b9d 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="12" y="4" width="8" height="24" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="4" y="12" width="24" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'ai-safe',
    title: 'Safe, Aligned AI',
    description: 'Ensure systems are trustworthy from the base up. Tackle value alignment, adversarial robustness, and bias mitigation at the core software level.',
    gradient: 'linear-gradient(135deg, #c2185b 0%, #ff2d78 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 3L28 8V18C28 24 16 30 16 30C16 30 4 24 4 18V8L16 3Z" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="16" cy="15" r="4" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'ai-infra',
    title: 'AI Infrastructure & Tooling',
    description: 'Build the foundational pipelines that power AI: distributed training frameworks, scalable simulators, dataset generators, and novel MLOps compilers.',
    gradient: 'linear-gradient(135deg, #ff2d78 0%, #ff00ff 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="6" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="10" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="16" y1="12" x2="16" y2="22" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  // --- ROBOTICS/HARDWARE TRACKS ---
  {
    id: 'robot-water',
    title: 'Pipeline Prowess',
    description: 'Robots for inspecting and repairing water infrastructure. Prototype crawlers or submersibles carrying sensor suites to combat leakages and protect clean water.',
    gradient: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 26C20 26 24 22 24 16C24 10 16 2 16 2C16 2 8 10 8 16C8 22 12 26 16 26Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 16C12 18.2 13.8 20 16 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'robot-grid',
    title: 'Grid Guardians',
    description: 'Autonomous systems to monitor electrical infrastructure. Develop drones or robots with computer vision and LiDAR to inspect substations and power lines.',
    gradient: 'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M18 4L8 16H16L14 28L24 16H16L18 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'robot-city',
    title: 'City Scanners',
    description: 'Maintain and map urban infrastructure. Push the limits of autonomous SLAM and structural analysis algorithms using wheeled robots and UAVs.',
    gradient: 'linear-gradient(135deg, #9d50bb 0%, #6e48aa 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 28H28" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="10" y="8" width="12" height="20" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="5" y="16" width="5" height="12" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="22" y="12" width="5" height="16" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'robot-agri',
    title: 'Farm to Fork',
    description: 'Tap into massive agricultural logistics. Tackle rugged outdoor terrain using smart tractors, crop-monitoring drones, and automated last-mile shipping robots.',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 2V30" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 12C20 6 26 8 26 14C26 18 20 20 16 16" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 18C12 12 6 14 6 20C6 24 12 26 16 22" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'robot-health',
    title: 'CuraBots',
    description: 'Robotics for healthcare settings. Design autonomous ward logistics, compliant lab handling systems, or UV disinfecting robots for clinical purity.',
    gradient: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 10V22" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 16H22" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'robot-transport',
    title: 'Mobility & Rail',
    description: 'Hardware for transport automation. Inspect rail networks and optimize cargo handling using high-fidelity vision processing and robust robotic integration.',
    gradient: 'linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M6 8H26" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 16H26" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 24H26" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 4V28" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M22 4V28" stroke="currentColor" strokeWidth="1.5"/>
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
            Twelve tracks across AI and Robotics. Infinite possibilities. Pick the challenge that ignites your passion.
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

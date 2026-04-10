'use client';

import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: '48h', label: 'Of Non-Stop Building' },
  { value: '500+', label: 'Builders Expected' },
  { value: '$50K', label: 'In Prizes' },
  { value: '24', label: 'Countries Represented' },
];

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2L16.5 9.5H24L18 14.5L20.5 22L14 17.5L7.5 22L10 14.5L4 9.5H11.5L14 2Z"/>
        <circle cx="14" cy="14" r="4" strokeDasharray="2 2"/>
      </svg>
    ),
    title: 'Build and Launch',
    description: 'Pure execution. Build real products in 48 hours and launch them to the world. No slides, no pitches. Code.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="14" r="12"/>
        <path d="M2 14H26"/>
        <path d="M14 2C17 6 18.5 10 18.5 14C18.5 18 17 22 14 26"/>
        <path d="M14 2C11 6 9.5 10 9.5 14C9.5 18 11 22 14 26"/>
      </svg>
    ),
    title: 'Global Network',
    description: 'Connect with the most ambitious builders, founders, and engineers across 24 countries.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="14,2 18,10 26,11 20,17 21.5,25 14,21 6.5,25 8,17 2,11 10,10"/>
      </svg>
    ),
    title: 'Real Stakes',
    description: 'Win funding, mentorship, and resources to take your project from hack to funded product.',
  },
];

export default function AboutSection() {
  const sectionRef = useRef(null);
  const elementsRef = useRef([]);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const cardsContainerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) rotateX(0deg)';
            entry.target.style.filter = 'blur(0)';
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    );

    elementsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addRef = (el) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  return (
    <section id="about" ref={sectionRef} className="about-section" style={styles.section}>
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />
      <div style={styles.bgLine1} />
      <div style={styles.bgLine2} />
      
      {/* 3D Cyber Blueprint Grid */}
      <div style={styles.technicalGrid} />

      <style>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
      `}</style>

      <div className="about-inner" style={styles.inner}>
        {/* Header */}
        <div
          ref={addRef}
          style={{
            ...styles.header,
            ...styles.animateUp,
          }}
        >
          <span style={styles.label}>
            <span style={styles.labelDot} />
            About <em style={styles.italic}>Shipathon</em>
          </span>

          <h2 style={styles.title}>
            Where <span style={styles.accent}>Ambition</span>
            <br />
            Meets <span style={styles.accent}>Execution</span>
          </h2>

          <p style={styles.description}>
            <em style={styles.italic}>Shipathon</em> isn&apos;t just a hackathon. It&apos;s a proving ground for the
            world&apos;s most driven builders. In 48 hours, you&apos;ll go from idea to
            launch, surrounded by people who don&apos;t just dream — they <em style={styles.italic}>ship</em>.
          </p>
        </div>

        {/* Stats Row */}
        <div
          ref={addRef}
          className="about-stats-row"
          style={{ ...styles.statsRow, ...styles.animateUp, transitionDelay: '0.15s' }}
        >
          {STATS.map((stat, i) => (
            <div key={i} className="about-stat-card" style={styles.statCard}>
              <span style={styles.statIndex}>{`0${i + 1}`}</span>
              <span className="about-stat-value" style={styles.statValue}>{stat.value}</span>
              <span style={styles.statDivider} />
              <span style={styles.statLabel}>{stat.label}</span>
              {i < STATS.length - 1 && <span className="about-stat-separator" style={styles.statSeparator} />}
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div ref={cardsContainerRef} className="about-features-grid" style={styles.features}>
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              ref={addRef}
              style={{
                ...styles.featureCard,
                ...styles.animateUp,
                transitionDelay: `${0.25 + i * 0.12}s`,
                borderColor: hoveredFeature === i ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.08)',
                background: hoveredFeature === i ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.015)',
                transform: hoveredFeature === i ? 'translateY(-4px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* Animated top border */}
              <div style={{
                ...styles.cardTopBorder,
                opacity: hoveredFeature === i ? 1 : 0,
              }} />

              <div style={{
                ...styles.featureIcon,
                color: hoveredFeature === i ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.35)',
              }}>
                {feature.icon}
              </div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>

              {/* Hover glow */}
              <div style={{
                ...styles.featureGlow,
                opacity: hoveredFeature === i ? 1 : 0,
              }} />

              {/* Number */}
              <span style={{
                ...styles.cardNumber,
                color: hoveredFeature === i ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.04)',
              }}>
                0{i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .about-stat-card:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.03) !important;
        }
        .about-stat-card:hover .about-stat-value {
          color: rgba(255, 255, 255, 0.98) !important;
        }
        @media (max-width: 900px) {
          .about-section { padding: 6rem 1rem !important; }
          .about-stats-row {
            grid-template-columns: repeat(2, 1fr) !important;
            border-radius: 14px !important;
          }
          .about-stat-card {
            min-height: 170px !important;
            padding: 2rem 1rem !important;
          }
          .about-stat-separator { display: none !important; }
          .about-features-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .about-stats-row { grid-template-columns: 1fr !important; }
          .about-stat-card {
            min-height: 150px !important;
            padding: 1.8rem 1rem !important;
          }
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
    padding: '10rem 2rem',
    overflow: 'hidden',
    background: '#000',
  },
  bgOrb1: {
    position: 'absolute',
    top: '5%',
    left: '-15%',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 45, 120, 0.07) 0%, transparent 70%)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },
  bgOrb2: {
    position: 'absolute',
    bottom: '5%',
    right: '-15%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(233, 30, 140, 0.05) 0%, transparent 70%)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },
  bgLine1: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 45, 120, 0.04) 30%, rgba(255, 45, 120, 0.04) 70%, transparent)',
    pointerEvents: 'none',
  },
  bgLine2: {
    position: 'absolute',
    bottom: '25%',
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03) 30%, rgba(255, 255, 255, 0.03) 70%, transparent)',
    pointerEvents: 'none',
  },
  technicalGrid: {
    position: 'absolute',
    bottom: '-10%',
    left: '-50%',
    right: '-50%',
    height: '500px',
    backgroundSize: '40px 40px',
    backgroundImage: `
      linear-gradient(to right, rgba(255, 45, 120, 0.06) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 45, 120, 0.06) 1px, transparent 1px)
    `,
    maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
    transform: 'perspective(400px) rotateX(65deg)',
    transformOrigin: 'bottom center',
    zIndex: 0,
    pointerEvents: 'none',
    animation: 'gridMove 2s linear infinite',
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
    marginBottom: '5rem',
  },
  animateUp: {
    opacity: 0,
    transform: 'translateY(50px) rotateX(5deg)',
    filter: 'blur(4px)',
    transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
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
  italic: {
    fontStyle: 'italic',
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    marginBottom: '1.5rem',
    marginTop: '1.5rem',
  },
  accent: {
    background: 'linear-gradient(135deg, #ff2d78, #e91e8c, #ff6b9d)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  description: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '1.05rem',
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.45)',
    maxWidth: '580px',
    margin: '0 auto',
    lineHeight: 1.75,
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 0,
    marginBottom: '5rem',
    background: 'rgba(255, 255, 255, 0.015)',
    borderRadius: '22px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.09)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  },
  statCard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '240px',
    padding: '3.25rem 1rem 2.9rem',
    background: 'rgba(255, 255, 255, 0.012)',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.35s ease',
  },
  statIndex: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.62rem',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.24)',
    letterSpacing: '0.24em',
    marginBottom: '1rem',
  },
  statValue: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 'clamp(2rem, 4.2vw, 3.15rem)',
    fontWeight: 800,
    color: 'rgba(255, 255, 255, 0.94)',
    letterSpacing: '-0.03em',
    lineHeight: 1,
    transition: 'color 0.35s ease',
  },
  statDivider: {
    width: '28px',
    height: '2px',
    background: 'rgba(255, 255, 255, 0.22)',
    margin: '0.95rem 0 0.85rem',
    borderRadius: '2px',
  },
  statLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.72rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    textAlign: 'center',
    lineHeight: 1.5,
    maxWidth: '90%',
  },
  statSeparator: {
    position: 'absolute',
    top: '20%',
    right: 0,
    width: '1px',
    height: '60%',
    background: 'rgba(255, 255, 255, 0.08)',
    pointerEvents: 'none',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
  },
  featureCard: {
    position: 'relative',
    padding: '2.5rem 2rem',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    overflow: 'hidden',
    cursor: 'none',
  },
  cardTopBorder: {
    position: 'absolute',
    top: 0,
    left: '2rem',
    right: '2rem',
    height: '1px',
    background: 'rgba(255, 255, 255, 0.35)',
    borderRadius: '0 0 4px 4px',
    transition: 'opacity 0.4s ease',
  },
  featureIcon: {
    marginBottom: '1.5rem',
    transition: 'color 0.4s ease',
  },
  featureTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '0.75rem',
    letterSpacing: '-0.01em',
  },
  featureDescription: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 1.7,
  },
  featureGlow: {
    position: 'absolute',
    bottom: '-45%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '220px',
    height: '220px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.08)',
    pointerEvents: 'none',
    filter: 'blur(60px)',
    transition: 'opacity 0.5s ease',
  },
  cardNumber: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '3rem',
    fontWeight: 800,
    transition: 'color 0.5s ease',
    lineHeight: 1,
  },
};

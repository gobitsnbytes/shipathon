'use client';

import { useEffect, useRef, useState } from 'react';

const MILESTONES = [
  {
    date: 'Apr 15',
    title: 'Registration Opens',
    description: 'Sign up and secure your spot. Early birds get exclusive perks.',
    status: 'completed',
  },
  {
    date: 'May 1',
    title: 'Team Formation',
    description: 'Find your dream team or go solo. Team matching available on Discord.',
    status: 'completed',
  },
  {
    date: 'May 10',
    title: 'Opening Ceremony',
    description: 'Kickoff stream with keynotes from industry leaders and track reveals.',
    status: 'active',
  },
  {
    date: 'May 10-12',
    title: '48h Build Sprint',
    description: 'The main event. Code, create, and sh1p something extraordinary.',
    status: 'upcoming',
  },
  {
    date: 'May 12',
    title: 'Submissions Close',
    description: 'Final demos and pitch decks due. Every line of code counts.',
    status: 'upcoming',
  },
  {
    date: 'May 15',
    title: 'Winners Announced',
    description: 'Live ceremony with prizes, shoutouts, and the crowning of champions.',
    status: 'upcoming',
  },
];

export default function TimelineSection() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const milestonesRef = useRef([]);
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    // Scroll-driven progress line
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      const sectionTop = rect.top;
      const sectionH = rect.height;

      // Progress starts when section enters view
      const progress = Math.max(
        0,
        Math.min(1, (windowH - sectionTop) / (sectionH + windowH * 0.3))
      );
      setLineProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0) scale(1)';
            entry.target.style.filter = 'blur(0px)';
          }
        });
      },
      { threshold: 0.15 }
    );

    milestonesRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="timeline" ref={sectionRef} style={styles.section}>
      <div style={styles.inner}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.label}>
            <span style={styles.labelDot} />
            Timeline
          </span>
          <h2 style={styles.title}>
            The <span style={styles.accent}>Journey</span>
          </h2>
          <p style={styles.subtitle}>
            From registration to victory. Every moment counts.
          </p>
        </div>

        {/* Timeline */}
        <div style={styles.timeline}>
          {/* Progress Line */}
          <div className="timeline-line-track" style={styles.lineTrack}>
            <div
              ref={lineRef}
              style={{
                ...styles.lineFill,
                height: `${lineProgress * 100}%`,
              }}
            />
          </div>

          {/* Milestones */}
          {MILESTONES.map((milestone, i) => (
            <div
              key={i}
              className="timeline-milestone"
              ref={(el) => (milestonesRef.current[i] = el)}
              style={{
                ...styles.milestone,
                opacity: 0,
                transform: i % 2 === 0 ? 'translateX(-50px) scale(0.95)' : 'translateX(50px) scale(0.95)',
                filter: 'blur(5px)',
                transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.12}s`,
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
              }}
            >
              {/* Content */}
              <div className="timeline-content" style={{
                ...styles.timelineContent,
                ...styles.milestoneContent,
                textAlign: i % 2 === 0 ? 'right' : 'left',
              }}>
                <span style={{
                  ...styles.milestoneDate,
                  color: milestone.status === 'active' ? '#ff2d78' : 'rgba(255, 255, 255, 0.3)',
                }}>
                  {milestone.date}
                </span>
                <h3 style={styles.milestoneTitle}>{milestone.title}</h3>
                <p className="timeline-desc" style={styles.milestoneDesc}>{milestone.description}</p>
              </div>

              {/* Dot */}
              <div style={styles.dotContainer}>
                <div style={{
                  ...styles.dot,
                  background: milestone.status === 'completed'
                    ? '#ff2d78'
                    : milestone.status === 'active'
                      ? '#ff2d78'
                      : 'rgba(255, 255, 255, 0.15)',
                  boxShadow: milestone.status === 'active'
                    ? '0 0 16px rgba(255, 45, 120, 0.6), 0 0 32px rgba(255, 45, 120, 0.3)'
                    : milestone.status === 'completed'
                      ? '0 0 8px rgba(255, 45, 120, 0.3)'
                      : 'none',
                }}>
                  {milestone.status === 'completed' && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {milestone.status === 'active' && (
                    <div style={styles.activePulse} />
                  )}
                </div>
              </div>

              {/* Spacer for opposite side */}
              <div className="timeline-spacer" style={styles.milestoneSpacer} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes timelinePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.8); opacity: 0; }
        }
        @media (max-width: 768px) {
          #timeline { padding: 6rem 1rem !important; }
          #timeline .timeline-line-track {
            left: 12px !important;
            transform: none !important;
          }
          #timeline .timeline-milestone {
            flex-direction: row !important;
            align-items: flex-start !important;
            gap: 0.9rem !important;
          }
          #timeline .timeline-milestone > div:nth-child(2) {
            order: -1;
          }
          #timeline .timeline-content,
          #timeline .timeline-milestone > div {
            text-align: left !important;
          }
          #timeline .timeline-desc {
            max-width: 100% !important;
          }
          #timeline .timeline-spacer {
            display: none !important;
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
    padding: '8rem 2rem',
    overflow: 'hidden',
    background: 'linear-gradient(180deg, #000 0%, #030103 50%, #000 100%)',
  },
  inner: {
    position: 'relative',
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '5rem',
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
    maxWidth: '400px',
    margin: '0 auto',
  },
  timeline: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
  },
  lineTrack: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: '1px',
    transform: 'translateX(-50%)',
    background: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  lineFill: {
    width: '100%',
    background: 'linear-gradient(180deg, #ff2d78, #e91e8c)',
    boxShadow: '0 0 12px rgba(255, 45, 120, 0.4)',
    transition: 'height 0.1s ease-out',
    borderRadius: '0 0 2px 2px',
  },
  milestone: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  milestoneContent: {
    flex: 1,
  },
  timelineContent: {
    flex: 1,
  },
  milestoneDate: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '0.4rem',
  },
  milestoneTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '0.3rem',
    letterSpacing: '-0.01em',
  },
  milestoneDesc: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.82rem',
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.4)',
    lineHeight: 1.55,
    maxWidth: '300px',
  },
  dotContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    flexShrink: 0,
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  activePulse: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#fff',
    animation: 'timelinePulse 2s ease-in-out infinite',
  },
  milestoneSpacer: {
    flex: 1,
  },
};

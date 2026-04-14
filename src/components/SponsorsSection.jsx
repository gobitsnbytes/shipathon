'use client';

import { useEffect, useRef, useState } from 'react';

const SPONSORS = {
  platinum: [
    { 
      name: "Phaser", 
      isLogoNode: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginTop: '8px' }}>
            <img src="/bitsnbytes.png" alt="Bits&Bytes" style={{ position: 'absolute', top: '-10px', left: '-20px', height: '14px', opacity: 0.9 }} />
            <img src="/phaser.png" alt="Phaser" style={{ height: '48px' }} />
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.05em' }}>Phaser</span>
        </div>
      )
    },
    { 
      name: 'SH1P', 
      isLogoNode: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div style={{ marginTop: '8px' }}>
            <img src="/shipaccelerator_logo.jpg" alt="Ship Accelerator" style={{ height: '48px', borderRadius: '4px' }} />
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.05em' }}>SH1P</span>
        </div>
      )
    },
  ],
  gold: [
    { name: 'Vercel', initials: 'VC' },
    { name: 'Supabase', initials: 'SB' },
    { name: 'Stripe', initials: 'ST' },
    { name: 'Figma', initials: 'FG' },
  ],
  silver: [
    { name: 'Railway', initials: 'RW' },
    { name: 'Linear', initials: 'LN' },
    { name: 'Notion', initials: 'NT' },
    { name: 'Resend', initials: 'RS' },
    { name: 'Planetscale', initials: 'PS' },
    { name: 'Clerk', initials: 'CK' },
  ],
};

export default function SponsorsSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSponsor, setHoveredSponsor] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="sponsors" ref={sectionRef} style={styles.section}>
      <div style={styles.inner}>
        {/* Header */}
        <div style={{
          ...styles.header,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <span style={styles.label}>
            <span style={styles.labelDot} />
            Partners
          </span>
          <h2 style={styles.title}>
            Backed by the <span style={styles.accent}>Best</span>
          </h2>
          <p style={styles.subtitle}>
            World-class companies powering world-class builders.
          </p>
        </div>

        {/* Platinum Tier */}
        <div style={{
          ...styles.tierContainer,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
        }}>
          <span style={styles.tierLabel}>Presenting Partners</span>
          <div className="platinum-row" style={styles.platinumRow}>
            {SPONSORS.platinum.map((sponsor, i) => (
              <div
                key={sponsor.name}
                className="platinum-card"
                style={{
                  ...styles.platinumCard,
                  borderColor: hoveredSponsor === `p-${i}` ? 'rgba(255, 45, 120, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  background: hoveredSponsor === `p-${i}` ? 'rgba(255, 45, 120, 0.03)' : 'rgba(255, 255, 255, 0.02)',
                }}
                onMouseEnter={() => setHoveredSponsor(`p-${i}`)}
                onMouseLeave={() => setHoveredSponsor(null)}
              >
                {sponsor.isLogoNode ? sponsor.isLogoNode : (
                  <>
                    <span style={styles.platinumInitials}>{sponsor.initials}</span>
                    <span style={styles.platinumName}>{sponsor.name}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Gold Tier */}
        <div style={{
          ...styles.tierContainer,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
        }}>
          <span style={styles.tierLabel}>Gold Sponsors</span>
          <div className="gold-row" style={styles.goldRow}>
            {SPONSORS.gold.map((sponsor, i) => (
              <div
                key={sponsor.name}
                className="gold-pill"
                style={{
                  ...styles.sponsorPill,
                  borderColor: hoveredSponsor === `g-${i}` ? 'rgba(255, 45, 120, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  color: hoveredSponsor === `g-${i}` ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)',
                }}
                onMouseEnter={() => setHoveredSponsor(`g-${i}`)}
                onMouseLeave={() => setHoveredSponsor(null)}
              >
                <span style={styles.pillInitials}>{sponsor.initials}</span>
                {sponsor.name}
              </div>
            ))}
          </div>
        </div>

        {/* Silver Tier - Marquee */}
        <div style={{
          ...styles.tierContainer,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
        }}>
          <span style={styles.tierLabel}>Community Partners</span>
          <div style={styles.marqueeContainer}>
            <div style={styles.marqueeTrack}>
              {[...SPONSORS.silver, ...SPONSORS.silver].map((sponsor, i) => (
                <span key={i} style={styles.marqueeItem}>
                  {sponsor.name}
                  <span style={styles.marqueeDot}>·</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Become a sponsor CTA */}
        <div style={{
          ...styles.sponsorCta,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
        }}>
          <p style={styles.sponsorCtaText}>Want to sponsor SH1PATHON?</p>
          <a href="#cta" data-hover style={styles.sponsorCtaLink}>Get in touch →</a>
        </div>
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          #sponsors { padding: 6rem 1rem !important; }
          #sponsors .platinum-row { flex-direction: column !important; }
          #sponsors .gold-row { flex-wrap: wrap !important; }
          #sponsors .platinum-card { padding: 2rem 1.25rem !important; }
          #sponsors .gold-pill { width: 100%; justify-content: center; }
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
  inner: {
    position: 'relative',
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
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
    maxWidth: '400px',
    margin: '0 auto',
  },
  tierContainer: {
    marginBottom: '3rem',
    textAlign: 'center',
  },
  tierLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.65rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: 'rgba(255, 255, 255, 0.25)',
    display: 'block',
    marginBottom: '1.5rem',
  },
  platinumRow: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
  },
  platinumCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '2.5rem 4rem',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    cursor: 'none',
    transition: 'all 0.4s ease',
  },
  platinumInitials: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '2rem',
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.02em',
    textShadow: '0 0 30px rgba(255, 45, 120, 0.15)',
  },
  platinumName: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.8rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: '0.05em',
  },
  goldRow: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  sponsorPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.8rem 1.5rem',
    borderRadius: '999px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    background: 'rgba(255, 255, 255, 0.02)',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'none',
    transition: 'all 0.3s ease',
  },
  pillInitials: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#ff2d78',
    opacity: 0.6,
  },
  marqueeContainer: {
    overflow: 'hidden',
    maskImage: 'linear-gradient(90deg, transparent, black 15%, black 85%, transparent)',
    WebkitMaskImage: 'linear-gradient(90deg, transparent, black 15%, black 85%, transparent)',
  },
  marqueeTrack: {
    display: 'flex',
    gap: '2rem',
    animation: 'marqueeScroll 20s linear infinite',
    whiteSpace: 'nowrap',
    width: 'max-content',
  },
  marqueeItem: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.9rem',
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  marqueeDot: {
    color: 'rgba(255, 45, 120, 0.3)',
    fontSize: '1.2rem',
  },
  sponsorCta: {
    textAlign: 'center',
    marginTop: '2rem',
    padding: '2rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
  },
  sponsorCtaText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.3)',
    marginBottom: '0.5rem',
  },
  sponsorCtaLink: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#ff2d78',
    textDecoration: 'none',
    cursor: 'none',
    transition: 'color 0.3s ease',
  },
};

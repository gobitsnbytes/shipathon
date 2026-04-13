'use client';

import { useEffect, useRef, useState } from 'react';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Tracks', href: '#tracks' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Sponsors', href: '#sponsors' },
];

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.8);

      // Track active section
      const sections = ['about', 'tracks', 'timeline', 'sponsors', 'cta'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 300) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMenuOpen]);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <nav
        className="nav-shell"
        ref={navRef}
        style={{
          ...styles.nav,
          transform: isVisible ? 'translate(-50%, 0)' : 'translate(-50%, -150%)',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div style={styles.navInner}>
          {/* Logo */}
          <a
            href="#"
            style={styles.logo}
            data-hover
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span style={styles.logoText}>SH1PATHON</span>
            <span style={styles.logoDot} />
          </a>

          {/* Desktop links */}
          <div className="nav-desktop-links" style={styles.links}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-hover
                style={{
                  ...styles.link,
                  color: activeSection === link.href.slice(1)
                    ? '#ff2d78'
                    : 'rgba(255, 255, 255, 0.6)',
                }}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            className="nav-cta-desktop"
            href="#cta"
            data-hover
            style={styles.navCta}
            onClick={(e) => handleLinkClick(e, '#cta')}
          >
            Register
          </a>

          {/* Mobile Menu Button */}
          <button
            className="nav-menu-btn"
            style={styles.menuBtn}
            data-hover
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div style={{
              ...styles.menuLine,
              transform: isMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
            }} />
            <div style={{
              ...styles.menuLine,
              opacity: isMenuOpen ? 0 : 1,
              transform: isMenuOpen ? 'translateX(10px)' : 'none',
            }} />
            <div style={{
              ...styles.menuLine,
              transform: isMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
            }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div style={styles.mobileOverlay}>
          <div style={styles.mobileContent}>
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                data-hover
                style={{
                  ...styles.mobileLink,
                  animationDelay: `${i * 80 + 100}ms`,
                }}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#cta"
              data-hover
              style={{
                ...styles.mobileCta,
                animationDelay: `${NAV_LINKS.length * 80 + 100}ms`,
              }}
              onClick={(e) => handleLinkClick(e, '#cta')}
            >
              Register Now
            </a>
          </div>

          <style>{`
            @keyframes mobileLinkIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-shell {
            width: calc(100% - 1rem) !important;
            top: 0.75rem !important;
            padding: 0.65rem 1rem !important;
            border-radius: 22px !important;
          }
          .nav-desktop-links, .nav-cta-desktop { display: none !important; }
          .nav-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    top: '1.5rem',
    left: '50%',
    width: '90%',
    maxWidth: '1000px',
    zIndex: 50,
    padding: '0.8rem 2rem',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    borderRadius: '100px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  navInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    textDecoration: 'none',
    cursor: 'none',
  },
  logoText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.1em',
  },
  logoDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: '#ff2d78',
    boxShadow: '0 0 8px rgba(255, 45, 120, 0.6)',
  },
  links: {
    display: 'flex',
    gap: '2.5rem',
  },
  link: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.8rem',
    fontWeight: 500,
    letterSpacing: '0.06em',
    textDecoration: 'none',
    cursor: 'none',
    transition: 'color 0.3s ease',
    textTransform: 'uppercase',
  },
  navCta: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #ff2d78, #e91e8c)',
    padding: '0.5rem 1.5rem',
    borderRadius: '999px',
    textDecoration: 'none',
    cursor: 'none',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 20px rgba(255, 45, 120, 0.2)',
  },
  menuBtn: {
    display: 'none', /* Overwritten by media query */
    flexDirection: 'column',
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'none',
    padding: '4px',
    zIndex: 60,
  },
  menuLine: {
    width: '20px',
    height: '1.5px',
    background: '#fff',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  mobileOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    zIndex: 49,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
  },
  mobileLink: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '2rem',
    fontWeight: 700,
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    cursor: 'none',
    letterSpacing: '-0.01em',
    animation: 'mobileLinkIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    opacity: 0,
  },
  mobileCta: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '1rem',
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #ff2d78, #e91e8c)',
    padding: '0.8rem 2rem',
    borderRadius: '999px',
    textDecoration: 'none',
    cursor: 'none',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    animation: 'mobileLinkIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    opacity: 0,
    marginTop: '1rem',
  },
};

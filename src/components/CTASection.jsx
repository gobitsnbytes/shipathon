'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const seededRandom = (seed) => {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
  return value - Math.floor(value);
};

const CURRENT_YEAR = new Date().getFullYear();

/* ─── 3D Mechanical Gear ─── */
function Gear({ position, radius = 1, teeth = 12, thickness = 0.15, speed = 0.5, color = '#ff2d78', wireframe = true }) {
  const meshRef = useRef();

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const inner = radius * 0.7;
    const toothH = radius * 0.2;
    const angleStep = (Math.PI * 2) / teeth;

    for (let i = 0; i < teeth; i++) {
      const a1 = angleStep * i;
      const a2 = a1 + angleStep * 0.3;
      const a3 = a1 + angleStep * 0.5;
      const a4 = a1 + angleStep * 0.8;

      if (i === 0) {
        shape.moveTo(Math.cos(a1) * radius, Math.sin(a1) * radius);
      }
      shape.lineTo(Math.cos(a2) * (radius + toothH), Math.sin(a2) * (radius + toothH));
      shape.lineTo(Math.cos(a3) * (radius + toothH), Math.sin(a3) * (radius + toothH));
      shape.lineTo(Math.cos(a4) * radius, Math.sin(a4) * radius);
    }
    shape.closePath();

    // Center hole
    const hole = new THREE.Path();
    const holeSegments = 32;
    for (let i = 0; i < holeSegments; i++) {
      const angle = (i / holeSegments) * Math.PI * 2;
      const x = Math.cos(angle) * inner * 0.3;
      const y = Math.sin(angle) * inner * 0.3;
      if (i === 0) hole.moveTo(x, y);
      else hole.lineTo(x, y);
    }
    shape.holes.push(hole);

    const extrudeSettings = { depth: thickness, bevelEnabled: false };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [radius, teeth, thickness]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += speed * 0.005;
    }
  });

  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={wireframe ? 0.15 : 0.08}
        wireframe={wireframe}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ─── Rotating Ring ─── */
function Ring({ position, radius = 1.5, tube = 0.02, speed = 0.3, color = '#ff2d78' }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.003;
      meshRef.current.rotation.y += speed * 0.002;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[radius, tube, 16, 64]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.12}
        wireframe
      />
    </mesh>
  );
}

/* ─── Orbital Particles ─── */
function OrbitalParticles({ count = 25 }) {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 2 + seededRandom(i * 3.17 + 0.1) * 3;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (seededRandom(i * 3.17 + 0.2) - 0.5) * 2;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.002;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ff2d78"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ─── CTA 3D Scene ─── */
function CTAScene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#ff2d78" />
      <pointLight position={[-3, 2, 3]} intensity={0.3} color="#e91e8c" />

      {/* Interlocking gears */}
      <Gear position={[-1.2, 0, 0]} radius={1.2} teeth={16} speed={0.3} thickness={0.08} />
      <Gear position={[1.5, 0.8, -0.5]} radius={0.8} teeth={10} speed={-0.5} thickness={0.08} color="#e91e8c" />
      <Gear position={[0.5, -1.3, 0.3]} radius={0.6} teeth={8} speed={0.7} thickness={0.08} color="#ff6b9d" />

      {/* Orbital rings */}
      <Ring position={[0, 0, 0]} radius={2.5} speed={0.2} />
      <Ring position={[0, 0, 0]} radius={3} tube={0.015} speed={-0.15} color="#e91e8c" />
      <Ring position={[0, 0, 0]} radius={3.5} tube={0.01} speed={0.1} color="#ff6b9d" />

      {/* Particles orbiting */}
      <OrbitalParticles count={25} />

      {/* Central icosahedron */}
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.3}>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[0.35, 1]} />
          <meshStandardMaterial
            color="#ff2d78"
            transparent
            opacity={0.08}
            wireframe
          />
        </mesh>
      </Float>
    </>
  );
}

/* ─── Registration Steps Data ─── */
const STEPS = [
  {
    num: '01',
    title: 'Register',
    desc: 'Sign up in 30 seconds. Free entry for all builders.',
    detail: 'Individual or team of up to 4',
  },
  {
    num: '02',
    title: 'Choose Track',
    desc: 'Pick your arena from 6 cutting-edge domains.',
    detail: 'AI, Web3, Climate, Health, Fintech, Open',
  },
  {
    num: '03',
    title: 'Build',
    desc: '48 hours of pure creation. Mentors. Resources. No limits.',
    detail: 'Workshops, office hours, API credits',
  },
  {
    num: '04',
    title: 'Launch',
    desc: 'Demo your creation. Win prizes. Change the game.',
    detail: '$50K in prizes + investor introductions',
  },
];

export default function CTASection() {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const btnRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Horizontal scroll with mouse wheel
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // Only prevent vertical scroll when hovering the horizontal container
      const rect = container.getBoundingClientRect();
      const isInBounds = e.clientY >= rect.top && e.clientY <= rect.bottom;

      if (isInBounds && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const atStart = container.scrollLeft <= 0 && e.deltaY < 0;
        const atEnd = container.scrollLeft >= maxScroll - 1 && e.deltaY > 0;

        if (!atStart && !atEnd) {
          e.preventDefault();
          container.scrollLeft += e.deltaY * 1.5;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Magnetic button
  const handleBtnMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x: x * 0.2, y: y * 0.2 });
  };

  const handleBtnMouseLeave = () => setMousePos({ x: 0, y: 0 });

  return (
    <section id="cta" ref={sectionRef} style={styles.section}>
      {/* 3D Background */}
      <div style={styles.canvasContainer}>
        {isVisible && (
          <Canvas
            camera={{ position: [0, 0, 6], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
            frameloop="always"
            style={{ position: 'absolute', inset: 0 }}
          >
            <CTAScene />
          </Canvas>
        )}
        <div style={styles.canvasOverlay} />
      </div>

      <div className="cta-inner" style={styles.inner}>
        {/* Header */}
        <div style={{
          ...styles.header,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <span style={styles.label}>
            <span style={styles.labelDot} />
            Join the Movement
          </span>

          <h2 className="cta-title" style={styles.title}>
            Ready to<br />
            <em style={styles.titleAccent}><em style={{ fontStyle: 'italic' }}>SH1P</em>?</em>
          </h2>
        </div>

        {/* Horizontal Scroll Steps */}
        <div style={{
          ...styles.scrollWrapper,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
        }}>
          <div ref={scrollContainerRef} style={styles.scrollContainer}>
            <div className="cta-scroll-track" style={styles.scrollTrack}>
              {STEPS.map((step, i) => (
                <div key={i} className="cta-step-card" style={styles.stepCard}>
                  <span style={styles.stepNum}>{step.num}</span>

                  <div style={styles.stepContent}>
                    <h3 style={styles.stepTitle}>{step.title}</h3>
                    <p style={styles.stepDesc}>{step.desc}</p>
                    <span style={styles.stepDetail}>{step.detail}</span>
                  </div>

                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div style={styles.connector}>
                      <div style={styles.connectorLine} />
                      <div style={styles.connectorDot} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="cta-scroll-hint" style={styles.scrollHint}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5">
              <path d="M6 3L11 8L6 13" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={styles.scrollHintText}>Scroll horizontally</span>
          </div>
        </div>

        {/* CTA Button */}
        <div style={{
          ...styles.ctaArea,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1s ease 0.5s',
        }}>
          <p style={styles.ctaSubtext}>
            48 hours. Unlimited potential.
            <br />
            Don&#39;t spectate. <em style={{ fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.6)' }}>Build</em>.
          </p>

          <div
            style={styles.btnContainer}
            onMouseMove={handleBtnMouseMove}
            onMouseLeave={handleBtnMouseLeave}
          >
            <a
              ref={btnRef}
              href="#"
              data-hover
              className="cta-register-btn"
              style={{
                ...styles.ctaBtn,
                transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
              }}
            >
              <span style={styles.ctaBtnText}>Register Now</span>
              <div style={styles.ctaBtnGlow} />
              <div style={styles.ctaBtnShine} />
            </a>
          </div>

          {/* Info row */}
          <div className="cta-info-row" style={styles.infoRow}>
            <div style={styles.infoItem}>
              <span style={styles.infoValue}>May 10-12</span>
              <span style={styles.infoLabel}>Event Date</span>
            </div>
            <div className="cta-info-divider" style={styles.infoDivider} />
            <div style={styles.infoItem}>
              <span style={styles.infoValue}>Virtual + IRL</span>
              <span style={styles.infoLabel}>Format</span>
            </div>
            <div className="cta-info-divider" style={styles.infoDivider} />
            <div style={styles.infoItem}>
              <span style={styles.infoValue}>Free</span>
              <span style={styles.infoLabel}>Entry</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="cta-footer-inner" style={styles.footerInner}>
          <div style={styles.footerLeft}>
            <span style={styles.footerLogo}><em style={{ fontStyle: 'italic' }}>SH1P</em>ATHON</span>
            <span style={styles.footerDot} />
          </div>
          <div style={{ ...styles.footerText, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <span>by</span>
            <div style={{ position: 'relative', display: 'inline-block', margin: '0 8px 0 6px' }}>
              <img src="/bitsnbytes.png" alt="Bits&Bytes" style={{ position: 'absolute', top: '-4px', left: '-10px', height: '6px', opacity: 0.9 }} />
              <img src="/phaser.png" alt="Phaser" style={{ height: '16px', opacity: 0.9 }} />
            </div>
            <span>Phaser<span style={{ color: '#ff2d78' }}>*</span> ×</span>
            <img src="/shipaccelerator_logo.jpg" alt="ShipLogo" style={{ height: '16px', borderRadius: '2px', marginLeft: '2px' }} />
            <span><em style={{ fontStyle: 'italic' }}>SH1P</em> · {CURRENT_YEAR}</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.35)', marginTop: '0.75rem', textAlign: 'center', maxWidth: '600px', lineHeight: 1.5 }}>
            * Phaser is a Bits&Bytes vertical dedicated to robotics builders, hardware hackers, and makers — the community for people who build things you can hold.
          </div>
          <div style={styles.footerLinks}>
            <a href="#" data-hover style={styles.footerLink}>Twitter</a>
            <a href="#" data-hover style={styles.footerLink}>Discord</a>
            <a href="#" data-hover style={styles.footerLink}>GitHub</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(300%) skewX(-15deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @media (max-width: 900px) {
          #cta { padding: 5rem 1rem 0 !important; }
          #cta .cta-inner { gap: 2rem !important; }
          #cta .cta-step-card { min-width: 280px !important; padding: 1.5rem 1.2rem !important; }
          #cta .cta-info-row {
            gap: 0.9rem !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
          }
          #cta .cta-info-divider { display: none !important; }
          #cta .cta-footer-inner { justify-content: center !important; text-align: center !important; }
        }
        @media (max-width: 600px) {
          #cta .cta-title { font-size: clamp(2.2rem, 15vw, 4rem) !important; line-height: 0.95 !important; }
          #cta .cta-step-card { min-width: 240px !important; }
          #cta .cta-register-btn { padding: 1rem 2.1rem !important; font-size: 0.85rem !important; }
          #cta .cta-scroll-hint { display: none !important; }
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6rem 2rem 0',
    overflow: 'hidden',
    background: '#000',
  },
  canvasContainer: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
  },
  canvasOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)',
    pointerEvents: 'none',
  },
  inner: {
    position: 'relative',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    zIndex: 1,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3rem',
  },
  header: {
    textAlign: 'center',
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
    padding: '0.4rem 1rem',
    borderRadius: '999px',
    border: '1px solid rgba(255, 45, 120, 0.2)',
    background: 'rgba(255, 45, 120, 0.05)',
    marginBottom: '1.5rem',
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
    fontSize: 'clamp(3rem, 9vw, 8rem)',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 0.9,
    letterSpacing: '-0.04em',
    marginTop: '1.5rem',
  },
  titleAccent: {
    background: 'linear-gradient(135deg, #ff2d78 0%, #e91e8c 40%, #ff6b9d 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0 0 80px rgba(255, 45, 120, 0.4))',
    fontStyle: 'normal',
  },
  scrollWrapper: {
    width: '100%',
    maxWidth: '1000px',
  },
  scrollContainer: {
    width: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollBehavior: 'smooth',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
    paddingBottom: '1rem',
  },
  scrollTrack: {
    display: 'flex',
    gap: '0',
    width: 'max-content',
    padding: '1rem 0',
  },
  stepCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '2rem 2.5rem',
    minWidth: '320px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '20px',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transition: 'all 0.4s ease',
    flexShrink: 0,
  },
  stepNum: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '3rem',
    fontWeight: 800,
    color: 'rgba(255, 45, 120, 0.12)',
    letterSpacing: '-0.03em',
    lineHeight: 1,
    flexShrink: 0,
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  stepTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.01em',
  },
  stepDesc: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.82rem',
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.4)',
    lineHeight: 1.5,
  },
  stepDetail: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 500,
    color: 'rgba(255, 45, 120, 0.45)',
    letterSpacing: '0.03em',
    marginTop: '0.2rem',
  },
  connector: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 0.5rem',
    flexShrink: 0,
  },
  connectorLine: {
    width: '30px',
    height: '1px',
    background: 'linear-gradient(90deg, rgba(255, 45, 120, 0.2), rgba(255, 45, 120, 0.05))',
  },
  connectorDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: 'rgba(255, 45, 120, 0.3)',
    flexShrink: 0,
  },
  scrollHint: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    marginTop: '0.5rem',
  },
  scrollHintText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.6rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.2)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  ctaArea: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  ctaSubtext: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '1rem',
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.4)',
    lineHeight: 1.7,
  },
  btnContainer: {
    padding: '1rem',
  },
  ctaBtn: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.3rem 4rem',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fff',
    background: 'linear-gradient(135deg, #ff2d78, #e91e8c)',
    border: 'none',
    borderRadius: '999px',
    cursor: 'none',
    textDecoration: 'none',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    overflow: 'hidden',
    boxShadow: '0 8px 40px rgba(255, 45, 120, 0.3), 0 0 80px rgba(255, 45, 120, 0.1)',
    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  ctaBtnText: {
    position: 'relative',
    zIndex: 2,
  },
  ctaBtnGlow: {
    position: 'absolute',
    inset: '-2px',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #ff2d78, #e91e8c, #ff6b9d, #ff2d78)',
    backgroundSize: '300% 300%',
    zIndex: -1,
    filter: 'blur(12px)',
    opacity: 0.4,
    animation: 'pulseGlow 3s ease-in-out infinite',
  },
  ctaBtnShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '30%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    animation: 'shine 4s ease-in-out infinite',
    zIndex: 1,
    pointerEvents: 'none',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '2.5rem',
    marginTop: '1rem',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem',
  },
  infoValue: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.01em',
  },
  infoLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.65rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.25)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  infoDivider: {
    width: '1px',
    height: '2.5rem',
    background: 'rgba(255, 255, 255, 0.06)',
  },
  footer: {
    width: '100%',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
    padding: '2rem',
    marginTop: 'auto',
  },
  footerInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  footerLogo: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: '0.1em',
  },
  footerDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#ff2d78',
    opacity: 0.5,
  },
  footerText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.75rem',
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.2)',
  },
  footerLinks: {
    display: 'flex',
    gap: '1.5rem',
  },
  footerLink: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.3)',
    textDecoration: 'none',
    cursor: 'none',
    transition: 'color 0.3s ease',
  },
};

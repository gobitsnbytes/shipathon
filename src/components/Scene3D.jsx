'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const seededRandom = (seed) => {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
  return value - Math.floor(value);
};

/* ─── Floating Particles ─── */
function Particles({ count = 120 }) {
  const mesh = useRef();
  const { viewport } = useThree();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const rx = seededRandom(i * 3.11 + 0.1);
      const ry = seededRandom(i * 3.11 + 0.2);
      const rz = seededRandom(i * 3.11 + 0.3);
      const rs = seededRandom(i * 3.11 + 0.4);
      const rzSize = seededRandom(i * 3.11 + 0.5);

      temp.push({
        position: [
          (rx - 0.5) * viewport.width * 4,
          (ry - 0.5) * viewport.height * 4,
          (rz - 0.5) * 12 - 5,
        ],
        speed: 0.0005 + rs * 0.003,
        size: 0.01 + rzSize * 0.05,
      });
    }
    return temp;
  }, [count, viewport]);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    particles.forEach((p, i) => {
      pos[i * 3] = p.position[0];
      pos[i * 3 + 1] = p.position[1];
      pos[i * 3 + 2] = p.position[2];
    });
    return pos;
  }, [particles, count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    const posArray = mesh.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += particles[i].speed;
      posArray[i * 3] += Math.sin(time * 0.5 + i * 0.7) * 0.0008;
      posArray[i * 3 + 2] += Math.cos(time * 0.3 + i) * 0.0003;

      if (posArray[i * 3 + 1] > viewport.height * 2) {
        posArray[i * 3 + 1] = -viewport.height * 2;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
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

/* ─── Abstract Story Geometrics ─── */
function AbstractStoryGeometrics({ scrollProgress, mousePos }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const p = scrollProgress.current;

    const mx = mousePos.current.x * 0.2;
    const my = mousePos.current.y * 0.2;

    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1 + my;
    groupRef.current.rotation.y = time * 0.15 + mx;

    groupRef.current.children.forEach((child, i) => {
      // Explode and assemble based on scroll
      const explodeFactor = Math.abs(p - 0.5) * 2; // 1 at edges, 0 at center (assembled!)
      
      const targetPos = child.userData.targetPos;
      if (targetPos) {
        // When assembled (p=0.5), it forms a coherent shape
        child.position.x += (targetPos[0] * (1 + explodeFactor * 4) - child.position.x) * 0.1;
        child.position.y += (targetPos[1] * (1 + explodeFactor * 4) - child.position.y) * 0.1 + Math.sin(time + i) * 0.002;
        child.position.z += (targetPos[2] * (1 + explodeFactor * 4) - child.position.z) * 0.1;
        
        child.rotation.x += 0.01 * (i % 2 === 0 ? 1 : -1) + (explodeFactor * 0.05);
        child.rotation.y += 0.015 * (i % 3 === 0 ? 1 : -1);
      }
    });
  });

  // Calculate positions for an assembled Icosahedron shell
  const geometries = useMemo(() => {
    const list = [];
    const phi = (1 + Math.sqrt(5)) / 2;
    const size = 1.2;
    // Corners of an icosahedron
    const vertices = [
      [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
      [0, -1,  phi], [0,  1,  phi], [0, -1, -phi], [0,  1, -phi],
      [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
    ];

    vertices.forEach(v => {
      list.push(
        new THREE.Vector3(v[0] * size, v[1] * size, v[2] * size)
      );
    });
    return list;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Core Energy Source */}
      <mesh>
        <octahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial 
          color="#111" 
          emissive="#ff2d78"
          emissiveIntensity={0.5}
          wireframe={true} 
          transparent 
          opacity={0.8}
        />
      </mesh>

      {/* Orbiting Shell Fragments */}
      {geometries.map((pos, i) => (
        <mesh key={i} userData={{ targetPos: [pos.x, pos.y, pos.z] }} position={[pos.x * 5, pos.y * 5, pos.z * 5]}>
          <tetrahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial 
            color="#ff2d78" 
            metalness={0.9} 
            roughness={0.1}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Floating Geometric Elements (enhanced) ─── */
function FloatingGeometrics({ mousePos }) {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    const time = state.clock.getElapsedTime();
    const mx = mousePos.current.x;
    const my = mousePos.current.y;

    group.current.children.forEach((child, i) => {
      child.rotation.x = time * 0.15 * (i % 2 === 0 ? 1 : -1) + my * 0.4;
      child.rotation.y = time * 0.12 * (i % 2 === 0 ? -1 : 1) + mx * 0.4;
      child.position.y += Math.sin(time * 0.8 + i * 2) * 0.001;
    });
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh position={[-5, 2, -4]}>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial color="#ff2d78" transparent opacity={0.1} wireframe />
        </mesh>
      </Float>

      <Float speed={0.9} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[5, -1.5, -5]}>
          <octahedronGeometry args={[0.45, 1]} />
          <meshStandardMaterial color="#e91e8c" transparent opacity={0.08} wireframe />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.5}>
        <mesh position={[3.5, 3.5, -6]}>
          <torusGeometry args={[0.4, 0.12, 16, 32]} />
          <meshStandardMaterial color="#ff6b9d" transparent opacity={0.07} wireframe />
        </mesh>
      </Float>

      <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.9}>
        <mesh position={[-4, -2.5, -7]}>
          <dodecahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#ff2d78" transparent opacity={0.06} wireframe />
        </mesh>
      </Float>

      {/* Extra: torus knot */}
      <Float speed={0.6} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[0, -3, -8]}>
          <torusKnotGeometry args={[0.3, 0.08, 64, 8, 2, 3]} />
          <meshStandardMaterial color="#e91e8c" transparent opacity={0.04} wireframe />
        </mesh>
      </Float>

      {/* Ring orbit */}
      <Float speed={0.4} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[0, 0, -3]}>
          <torusGeometry args={[3, 0.008, 8, 64]} />
          <meshStandardMaterial color="#ff2d78" transparent opacity={0.06} />
        </mesh>
      </Float>
    </group>
  );
}

/* ─── Cursor Light ─── */
function CursorLight({ mousePos }) {
  const light = useRef();

  useFrame(() => {
    if (!light.current) return;
    light.current.position.x += (mousePos.current.x * 5 - light.current.position.x) * 0.05;
    light.current.position.y += (mousePos.current.y * 3 - light.current.position.y) * 0.05;
    light.current.position.z = 4;
  });

  return (
    <pointLight ref={light} color="#ff2d78" intensity={1.2} distance={15} decay={2} />
  );
}

/* ─── Main Scene ─── */
function SceneContent({ scrollProgress, mousePos }) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#ffffff" />
      <pointLight position={[-6, -4, 4]} intensity={0.4} color="#ff2d78" />
      <pointLight position={[6, 3, -2]} intensity={0.2} color="#e91e8c" />

      <CursorLight mousePos={mousePos} />

      <AbstractStoryGeometrics scrollProgress={scrollProgress} mousePos={mousePos} />
      <FloatingGeometrics mousePos={mousePos} />
      <Particles count={100} />

      <Environment preset="city" environmentIntensity={0.12} />
    </>
  );
}

/* ─── Exported Component ─── */
export default function Scene3D() {
  const containerRef = useRef(null);
  const scrollProgress = useRef(0);
  const mousePos = useRef({ x: 0, y: 0 });
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowH = window.innerHeight;

      const inView = rect.top < windowH && rect.bottom > 0;
      setIsInView(inView);

      const sectionStart = container.offsetTop - windowH;
      const sectionLength = container.offsetHeight + windowH;
      const scrolled = window.scrollY - sectionStart;
      scrollProgress.current = Math.max(0, Math.min(1, scrolled / sectionLength));
    };

    const handleMouseMove = (e) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section ref={containerRef} style={styles.container}>
      <div style={styles.bgGradient} />

      {isInView && (
        <Canvas
          style={styles.canvas}
          camera={{ position: [0, 1.5, 5.5], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
          frameloop="always"
        >
          <SceneContent scrollProgress={scrollProgress} mousePos={mousePos} />
        </Canvas>
      )}

      {/* Subtle text overlay */}
      <div style={styles.overlayText}>
        <p style={styles.floatingLabel}>Assemble the sequence</p>
      </div>

      {/* Bottom fade to next section */}
      <div style={styles.bottomFade} />
    </section>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '300vh', // Extended for longer animation
    overflow: 'hidden',
  },
  bgGradient: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, #000 0%, #030103 20%, #08010a 50%, #030103 80%, #000 100%)',
    zIndex: 0,
  },
  canvas: {
    position: 'sticky',
    top: 0,
    width: '100%',
    height: '100vh',
    zIndex: 1,
  },
  overlayText: {
    position: 'absolute',
    top: '8vh',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  floatingLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.65rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.15)',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    animation: 'float 4s ease-in-out infinite',
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '20vh',
    background: 'linear-gradient(to top, #000, transparent)',
    zIndex: 2,
    pointerEvents: 'none',
  },
};

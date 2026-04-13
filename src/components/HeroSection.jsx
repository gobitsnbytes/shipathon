'use client';

import { useEffect, useRef } from 'react';
import { getFrameImage } from './sequenceCache';

const STORY_PHASES = [
  {
    kicker: "01 // THE IGNITION",
    title: "THE ULTIMATE BUILD EVENT",
    text: "48 hours. One mission. SH1P something extraordinary. No slides, no business plans. Just pure execution and relentless ambition."
  },
  {
    kicker: "02 // THE DECONSTRUCTION",
    title: "TEAR IT ALL APART",
    text: "Deconstruct your assumptions. We provide the bleeding-edge hardware, APIs, and raw resources. You provide the audacity to build what shouldn't be built in a weekend."
  },
  {
    kicker: "03 // THE ASSEMBLY",
    title: "PIECE BY PIECE",
    text: "Forge your stack. From artificial intelligence nodes to massive decentralized ledgers. Every component you hack together pushes humanity one step closer to the singularity."
  },
  {
    kicker: "04 // THE DEPLOYMENT",
    title: "READY TO LAUNCH",
    text: "The countdown ends. Deploy your architecture, pitch your vision, and conquer. Will your creation survive the ultimate test of user friction? Let's find out."
  }
];

export default function HeroSection() {
  const sectionRef = useRef(null);
  const leftScrollRef = useRef(null);
  const canvasRef = useRef(null);
  const blocksRef = useRef([]);
  const isLowMotionRef = useRef(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const lowMotionQuery = window.matchMedia('(max-width: 900px), (pointer: coarse), (prefers-reduced-motion: reduce)');
    isLowMotionRef.current = lowMotionQuery.matches;

    // Draw the initial frame to prevent blank screen
    const initialFrame = getFrameImage(0);
    if (initialFrame && initialFrame.complete) {
        ctx.drawImage(initialFrame, 0, 0, canvas.width, canvas.height);
    }

    if (isLowMotionRef.current) {
      blocksRef.current.forEach((block) => {
        if (!block) return;
        block.style.opacity = 1;
      });
      return () => {};
    }

    let targetProgress = 0;
    let currentFrame = 0;
    let lastRenderedFrame = -1;
    let frameId;
    let frameCount = 0;
    const NUM_PHASES = 5;
    const TOTAL_FRAMES = 241;

    const handleScroll = () => {
      const scroller = leftScrollRef.current;
      if (!scroller) return;
      
      const scrollTop = scroller.scrollTop;
      const scrollHeight = scroller.scrollHeight;
      const clientHeight = scroller.clientHeight;

      let p = scrollTop / (scrollHeight - clientHeight);
      p = Math.max(0, Math.min(1, p));
      
      const intervals = NUM_PHASES - 1;
      targetProgress = Math.round(p * intervals) / intervals;
    };

    const updatePlayhead = () => {
      // Hardware Accelerated Sequence Drawing
      const targetFrameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(targetProgress * (TOTAL_FRAMES - 1))));
      
      // Smooth easing in both directions (forward and reverse)
      currentFrame += (targetFrameIndex - currentFrame) * 0.12;
      
      const frameToDraw = Math.round(currentFrame);

      // Only draw to canvas if the frame actually changed to save GPU cycles
      if (frameToDraw !== lastRenderedFrame) {
          const img = getFrameImage(frameToDraw);
          if (img && img.complete) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              lastRenderedFrame = frameToDraw;
          }
      }

      // Every 5th frame: update block opacity (NO blur — blur forces full re-rasterization)
      frameCount++;
      if (frameCount % 5 === 0) {
        const windowH = window.innerHeight;
        blocksRef.current.forEach((block) => {
          if (!block) return;
          const blockRect = block.getBoundingClientRect();
          const distFromCenter = Math.abs(blockRect.top + blockRect.height / 2 - windowH / 2);
          
          if (distFromCenter < 50) {
              block.style.opacity = 1;
          } else {
              let opacity = 1 - (distFromCenter / (windowH * 0.5));
              opacity = Math.max(0.05, Math.min(1, opacity));
              block.style.opacity = opacity;
          }
        });
      }

      frameId = requestAnimationFrame(updatePlayhead);
    };

    const scrollContainer = leftScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    handleScroll();
    frameId = requestAnimationFrame(updatePlayhead);

    return () => {
      if (scrollContainer) scrollContainer.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-container" id="hero">
      {/* Right Side: Fixed Video container */}
      <div className="hero-right">
        <div className="video-sticky">
          <div className="video-wrapper">
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className="story-video"
            />
            <div className="video-overlay" />
          </div>
        </div>
      </div>

      {/* Left Side: Native Snap Scrolling Context */}
      <div className="hero-left" ref={leftScrollRef}>
        <div className="story-blocks-container">
          
          {/* Main Title Block */}
          <div className="story-block hero-title-block">
            
            <div className="tech-badge">
                <span className="pulse-dot"></span>
                <div style={{ position: 'relative', display: 'inline-block', margin: '0 6px 0 4px', transform: 'translateY(1px)' }}>
                  <img src="/bitsnbytes.png" alt="Bits&Bytes" style={{ position: 'absolute', top: '-4px', left: '-8px', height: '5px', opacity: 0.9 }} />
                  <img src="/phaser.png" alt="Phaser" style={{ height: '12px', opacity: 0.9 }} />
                </div>
                <span>BITS&BYTES' PHASER <span style={{ opacity: 0.6 }}>// SYS.INIT</span></span>
            </div>

            <h1 className="main-title">
              <span className="title-glowing-wrapper hero-shipathon">
                 <span className="text-ship">SHIP</span>
                 <span className="text-athon">ATHON</span>
              </span>
            </h1>
            
            <p className="main-subtitle">
              <span className="text-highlight">48 hours.</span> One mission. <br/>
              <em className="ship-inline">Ship</em> something extraordinary.
            </p>
            
            <div className="cta-container">
              <a href="#cta" data-hover className="cta-primary">
                <span>Register Now <span className="cta-arrow">→</span></span>
                <div className="btn-shine" />
              </a>
              <a href="#about" data-hover className="cta-outline">
                <span>Learn More</span>
              </a>
            </div>
            
            <div className="scroll-indicator premium-scroll">
              <div className="scroll-track"><div className="scroll-playhead" /></div>
              <span className="scroll-text">INITIATE DECONSTRUCTION</span>
            </div>
          </div>

          {/* Narrative Phases */}
          {STORY_PHASES.map((phase, idx) => (
            <div 
              key={idx} 
              className="story-block phase-block"
              ref={el => blocksRef.current[idx] = el}
            >
              <div className="phase-bg-number">0{idx + 1}</div>
              <div className="phase-content">
                <span className="phase-kicker">{phase.kicker}</span>
                <h2 className="phase-title">{phase.title}</h2>
                <p className="phase-text">{phase.text}</p>
              </div>
            </div>
          ))}

        </div>
      </div>

      <style>{`
        .hero-container {
          display: flex;
          width: 100%;
          height: 100vh;
          background: #000;
          overflow: hidden;
        }

        /* Right Side Fixed Video Area */
        .hero-right {
          width: 50vw;
          height: 100vh;
          z-index: 50;
        }
        .video-sticky {
          width: 100%;
          height: 100vh;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .video-wrapper {
          position: relative;
          width: 100%;
          max-width: 1200px;
          aspect-ratio: 16 / 9;
          display: flex;
          align-items: center;
          -webkit-mask-image: linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%);
          mask-image: linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%);
        }
        .story-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          mix-blend-mode: screen;
          background: transparent;
        }
        .video-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #000 0%, rgba(0,0,0,0.15) 15%, transparent 100%);
          pointer-events: none;
        }

        /* Left Side Internal Scroller with STRICT Snapping */
        .hero-left {
          width: 50vw;
          height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          scroll-snap-type: y mandatory;
          z-index: 5;
          /* Hide scrollbar for immersion */
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hero-left::-webkit-scrollbar {
          display: none;
        }
        .story-blocks-container {
          padding-bottom: 0px;
          display: flex;
          flex-direction: column;
        }
        .story-block {
          height: 100vh;
          width: 100%;
          scroll-snap-align: center;
          scroll-snap-stop: always;
          flex: 0 0 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 clamp(2rem, 4vw, 5rem);
          transition: opacity 0.15s ease-out;
          position: relative;
        }
        .hero-title-block {
          align-items: flex-start;
          padding-top: 10vh;
        }
        
        .tech-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem 1.25rem;
            background: rgba(255, 45, 120, 0.05);
            border: 1px solid rgba(255, 45, 120, 0.2);
            border-radius: 100px;
            font-family: 'Space Grotesk', monospace;
            font-size: 0.75rem;
            color: #ff2d78;
            letter-spacing: 0.15em;
            margin-bottom: 2.5rem;
            box-shadow: 0 0 20px rgba(255, 45, 120, 0.1);
        }
        .pulse-dot {
            width: 6px; height: 6px;
            background: #ff2d78;
            border-radius: 50%;
            box-shadow: 0 0 10px #ff2d78;
            animation: pulseDot 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulseDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.3); } }

        /* Typography */
        .main-title {
          display: flex;
          flex-direction: column;
          line-height: 0.85;
          margin: 0;
        }
        .title-glowing-wrapper {
          position: relative;
          display: inline-block;
        }
        .hero-shipathon {
          display: inline-flex;
          align-items: center;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(3rem, 10vw, 8.5rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          white-space: nowrap;
          filter: drop-shadow(0px 15px 40px rgba(255,45,120,0.4));
        }
        .text-ship {
          color: #ffffff;
          font-style: italic;
          text-shadow: 0 0 20px rgba(255,255,255,0.4);
        }
        .text-athon {
          color: #ff2d78;
        }
        
        .main-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.1rem, 2vw, 1.35rem);
          color: rgba(255, 255, 255, 0.55);
          margin-top: 2rem;
          max-width: 500px;
          line-height: 1.6;
          font-weight: 300;
        }
        .text-highlight { color: rgba(255, 255, 255, 0.95); font-weight: 500; }
        .ship-inline { font-style: italic; font-weight: 600; color: #ff2d78; }

        /* Phases */
        .phase-block {
          align-items: flex-start;
          padding-right: 15%;
          overflow: hidden;
        }
        .phase-bg-number {
          position: absolute;
          top: 50%;
          left: -2rem;
          transform: translateY(-50%);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 38vw;
          font-weight: 900;
          color: rgba(255, 45, 120, 0.03);
          z-index: 0;
          pointer-events: none;
          letter-spacing: -0.05em;
          user-select: none;
        }
        .phase-content {
          position: relative;
          z-index: 10;
        }
        .phase-kicker {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #ff2d78;
          letter-spacing: 0.15em;
          margin-bottom: 1.2rem;
          display: inline-block;
          padding: 4px 12px;
          border: 1px solid rgba(255, 45, 120, 0.3);
          border-radius: 4px;
        }
        .phase-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 3.5vw, 4.5rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          word-break: break-word;
        }
        .phase-text {
          font-family: 'Inter', sans-serif;
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.7;
          max-width: 90%;
        }

        /* Buttons & UI - Premium Overhaul */
        .cta-container {
          display: flex;
          gap: 1.5rem;
          margin-top: 4rem;
        }
        .cta-primary {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1.2rem 3rem;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          color: #fff;
          background: linear-gradient(135deg, #ff2d78, #ff0860);
          border: 1px solid rgba(255,45,120,1);
          border-radius: 999px;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          overflow: hidden;
          box-shadow: 0 10px 40px -10px rgba(255, 45, 120, 0.8), inset 0 2px 5px rgba(255, 255, 255, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cta-primary:hover {
          box-shadow: 0 15px 50px -5px rgba(255, 45, 120, 1), inset 0 2px 10px rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }
        .cta-arrow {
            transition: transform 0.3s ease;
            display: inline-block;
        }
        .cta-primary:hover .cta-arrow {
            transform: translateX(4px);
        }
        .btn-shine {
          position: absolute; top: 0; left: 0; width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: btnShine 4s ease-in-out infinite;
          pointer-events: none;
        }
        .cta-outline {
          display: flex;
          align-items: center;
          padding: 1.2rem 3rem;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.03);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.3s;
        }
        .cta-outline:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.4);
        }
        @keyframes btnShine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
        }

        /* Tech Indicator Overhaul */
        .premium-scroll {
            margin-top: 5rem;
            display: flex;
            gap: 1.2rem;
            align-items: center;
            opacity: 0.7;
        }
        .scroll-track {
            width: 2px; height: 60px;
            background: rgba(255,255,255,0.1);
            position: relative;
            overflow: hidden;
            border-radius: 2px;
        }
        .scroll-playhead {
            position: absolute; top: 0; left: 0px;
            width: 2px; height: 20px;
            background: #ff2d78;
            border-radius: 2px;
            box-shadow: 0 0 10px #ff2d78, 0 0 20px #ff2d78;
            animation: playheadScan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .scroll-text {
            font-family: 'Space Grotesk', monospace;
            font-size: 0.75rem;
            letter-spacing: 0.35em;
            color: rgba(255,255,255,0.5);
            text-transform: uppercase;
            font-weight: 500;
        }
        @keyframes playheadScan { 
            0% { transform: translateY(-20px); opacity: 0; } 
            20% { opacity: 1; } 
            80% { opacity: 1; } 
            100% { transform: translateY(60px); opacity: 0; } 
        }

        @media (max-width: 900px) {
          .hero-container { position: relative; display: block; height: auto; min-height: 100vh; }
          .hero-right { position: absolute; inset: 0; width: 100%; z-index: 0; }
          .video-wrapper { max-width: none; width: 100%; height: 100vh; aspect-ratio: auto; }
          .hero-left { position: relative; width: 100%; z-index: 5; scroll-snap-type: y proximity; }
          .story-block { padding: 0 1.5rem; align-items: center; text-align: center; }
          .hero-title-block { padding-top: 6vh; }
          .phase-block { padding-right: 1.5rem; }
          .phase-bg-number { left: 50%; transform: translate(-50%, -50%); font-size: 52vw; }
          .phase-text { max-width: 100%; font-size: 1rem; }
          .main-subtitle { font-size: 1rem; }
          .cta-container { justify-content: center; margin-top: 2.25rem; width: 100%; }
          .scroll-indicator { justify-content: center; width: 100%; }
          .premium-scroll { margin-top: 2.25rem; }
          .tech-badge { font-size: 0.65rem; letter-spacing: 0.11em; margin-bottom: 1.5rem; }
        }

        @media (max-width: 640px) {
          .hero-shipathon { font-size: clamp(2.8rem, 17vw, 4.4rem); }
          .phase-title { font-size: clamp(1.6rem, 10vw, 2.4rem); }
          .phase-kicker { font-size: 0.7rem; }
          .cta-container { flex-direction: column; gap: 0.9rem; }
          .cta-primary, .cta-outline {
            width: 100%;
            justify-content: center;
            padding: 1rem 1.25rem;
            font-size: 0.82rem;
          }
          .premium-scroll { display: none; }
        }
      `}</style>
    </section>
  );
}

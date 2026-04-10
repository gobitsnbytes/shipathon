'use client';

import { useEffect, useRef } from 'react';

const STORY_PHASES = [
  {
    kicker: "01 // THE IGNITION",
    title: "THE ULTIMATE BUILD EVENT",
    text: "48 hours. One mission. Ship something extraordinary. No slides, no business plans. Just pure execution and relentless ambition."
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
  const videoRef = useRef(null);
  const blocksRef = useRef([]);
  const audioCtxRef = useRef(null);
  const isLowMotionRef = useRef(false);
  
  // Custom Web Audio API Synthesizer to create mechanical gear ticks natively!
  const playGearTick = (isHeavy = false) => {
    if (isLowMotionRef.current) return;

    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      // 1. Low physical thud (Sub-bass / Magnet locking)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(isHeavy ? 150 : 80, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + (isHeavy ? 0.15 : 0.05));
      gain1.gain.setValueAtTime(isHeavy ? 0.08 : 0.02, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isHeavy ? 0.15 : 0.05));
      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      // 2. High metallic click (Click / Servo mechanism)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(isHeavy ? 800 : 400 + Math.random() * 200, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);
      gain2.gain.setValueAtTime(isHeavy ? 0.04 : 0.01, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(); osc1.stop(ctx.currentTime + (isHeavy ? 0.15 : 0.05));
      osc2.start(); osc2.stop(ctx.currentTime + 0.03);
    } catch {}
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const lowMotionQuery = window.matchMedia('(max-width: 900px), (pointer: coarse), (prefers-reduced-motion: reduce)');
    isLowMotionRef.current = lowMotionQuery.matches;

    const onMetadataLoaded = () => {
      video.currentTime = 0;

      if (!isLowMotionRef.current) {
        video.pause();
      }
    };

    if (video.readyState >= 1) {
      onMetadataLoaded();
    } else {
      video.addEventListener('loadedmetadata', onMetadataLoaded, { once: true });
    }

    if (isLowMotionRef.current) {
      blocksRef.current.forEach((block) => {
        if (!block) return;
        block.style.opacity = 1;
        block.style.filter = 'blur(0px)';
      });

      video.loop = true;
      video.playbackRate = 1;
      const playPromise = video.play();
      if (typeof playPromise?.catch === 'function') {
        playPromise.catch(() => {});
      }

      return () => {
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close().catch(() => {});
        }
      };
    }

    let targetProgress = 0;
    let frameId;
    const NUM_PHASES = 5; // Title + 4 phases

    const handleScroll = () => {
      const scroller = leftScrollRef.current;
      if (!scroller) return;
      
      const scrollTop = scroller.scrollTop;
      const scrollHeight = scroller.scrollHeight;
      const clientHeight = scroller.clientHeight;

      // Calculate progress (0 to 1) perfectly within the left container
      let p = scrollTop / (scrollHeight - clientHeight);
      p = Math.max(0, Math.min(1, p));
      
      const intervals = NUM_PHASES - 1;
      const newTarget = Math.round(p * intervals) / intervals;
      
      if (newTarget !== targetProgress) {
          playGearTick(true); // Heavy chunk click!
          targetProgress = newTarget;
      }
    };

    let lastTick = 0;
    const updatePlayhead = () => {
      // Native Video Playback logic for absolutely fluid rendering
      if (video.duration && isFinite(video.duration)) {
        const targetTime = targetProgress * video.duration;
        const current = video.currentTime;
        const delta = targetTime - current;
        const absDelta = Math.abs(delta);

        // Relaxed boundary. Crucially, we do NOT snap currentTime to targetTime 
        // at the end, preventing the jagged 2-frame micro-stutter at lock!
        if (absDelta > 0.08) {
          
          const tickDelay = Math.max(40, 180 - (absDelta * 80));
          if (Date.now() - lastTick > tickDelay) {
             playGearTick();
             lastTick = Date.now();
          }

          if (delta > 0) {
            if (video.paused) video.play();
            
            // Stepped Cinematic Deceleration to prevent decoder clock thrashing!
            // We set the absolute minimum speed to 0.75x. If we drop it to 0.12x like before,
            // a 30FPS video physically renders at 3 frames-per-second, which looks exactly like lag!
            let targetRate = 1.0;
            if (absDelta > 1.5) targetRate = 2.5;       // Fast scrubbing
            else if (absDelta > 0.8) targetRate = 1.5;  // Normal approach
            else if (absDelta > 0.3) targetRate = 0.9;  // Easing in
            else targetRate = 0.75;                     // Final smooth floor without losing FPS
            
            // ONLY explicitly set if changed to avoid locking the internal presentation timestamp
            if (video.playbackRate !== targetRate) {
                video.playbackRate = targetRate;
            }
          } else {
            if (!video.paused) video.pause();
            
            // Stepped reverse scrubbing
            let step = 0.12;
            if (absDelta > 1.5) step = 0.25;
            else if (absDelta > 0.8) step = 0.15;
            else if (absDelta > 0.3) step = 0.08;
            else step = 0.05;

            video.currentTime -= step; 
          }
        } else {
          // Let it natively rest naturally exactly where the decoder halted.
          // Zero forced assignment = zero visual jumping!
          if (!video.paused) {
             video.pause();
             video.playbackRate = 1.0; 
          }
        }
      }

      // Check the exact visual center for blurring
      const windowH = window.innerHeight;
      blocksRef.current.forEach((block) => {
        if (!block) return;
        const blockRect = block.getBoundingClientRect();
        const distFromCenter = Math.abs(blockRect.top + blockRect.height / 2 - windowH / 2);
        
        // Ensure absolutely crystal clear text only when perfectly centered!
        if (distFromCenter < 50) {
            block.style.opacity = 1;
            block.style.filter = `blur(0px)`;
        } else {
            let opacity = 1 - (distFromCenter / (windowH * 0.5));
            opacity = Math.max(0.05, Math.min(1, opacity));
            block.style.opacity = opacity;
            block.style.filter = `blur(${Math.max(0, (1 - opacity) * 12)}px)`;
        }
      });

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

      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-container" id="hero">
      {/* Right Side: Fixed Video container */}
      <div className="hero-right">
        <div className="video-sticky">
          <div className="video-wrapper">
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="story-video"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
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
                PHASER_SYS.LOG.001 // BOOT SEQUENCE
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
          will-change: opacity, filter;
          transition: filter 0.15s ease-out, opacity 0.15s ease-out;
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
          font-size: clamp(4rem, 8vw, 8.5rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          word-break: break-word;
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
            0% { top: -20px; opacity: 0; } 
            20% { opacity: 1; } 
            80% { opacity: 1; } 
            100% { top: 60px; opacity: 0; } 
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

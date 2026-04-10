'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Loader from '@/components/Loader';
import Cursor from '@/components/Cursor';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
const TracksSection = dynamic(() => import('@/components/TracksSection'), {
  loading: () => <SectionFallback />,
});
const TimelineSection = dynamic(() => import('@/components/TimelineSection'), {
  loading: () => <SectionFallback />,
});
const SponsorsSection = dynamic(() => import('@/components/SponsorsSection'), {
  loading: () => <SectionFallback />,
});
const CTASection = dynamic(() => import('@/components/CTASection'), {
  loading: () => <SectionFallback />,
});

function SectionFallback() {
  return (
    <section
      aria-hidden="true"
      style={{
      width: '100%',
      minHeight: '40vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      }}
    />
  );
}

function Divider() {
  return (
    <div style={{
      width: '100%',
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06) 20%, rgba(255, 45, 120, 0.08) 50%, rgba(255, 255, 255, 0.06) 80%, transparent)',
    }} />
  );
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  return (
    <>
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}

      <div style={{
        opacity: showContent ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}>
        <Cursor />
        <Navigation />

        <main>
          <HeroSection />

          <Divider />
          <AboutSection />
          <Divider />
          <TracksSection />
          <Divider />
          <TimelineSection />
          <Divider />
          <SponsorsSection />
          <Divider />
          <CTASection />
        </main>
      </div>
    </>
  );
}

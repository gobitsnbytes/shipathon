# SH1PATHON 🚀

**The ultimate build event by Bits&Bytes' Phaser × SH1P.**

SH1PATHON is a highly-optimized, aesthetically premium Next.js landing page built to represent the most ambitious hackathon on the planet. It utilizes modern WebGL, canvas-based image sequencing, and scroll-triggered animations to deliver a seamless, state-of-the-art interactive experience.

## ✨ Features

- **Hardware-Accelerated Hero Sequence:** Employs an 'Apple-style' Canvas 2D image sequence renderer tied precisely to scroll position, achieving flawless 60fps directional scrubbing with zero main-thread blockage.
- **Dynamic GSAP Animations:** Fully responsive, scroll-linked object reveals, timeline masking, and cinematic typography powered by GSAP and ScrollTrigger.
- **Premium Design System:** Designed utilizing custom utility aesthetics, glassmorphism UI traits, pulsing micro-animations, and sleek dark mode color palettes tailored to the `SH1P` & `Phaser` branding.
- **Intelligent Preloading:** Custom caching mechanisms ensure critical assets (like sequence frames) are mapped directly to memory without causing layout shifts or LCP penalties.
- **Automated CI/Deploy:** Directly integrated with GitHub Actions for automatic `pnpm`-native build resolutions and deployments to GitHub Pages.

## 🛠️ Tech Stack 

- **Framework:** Next.js 16 (React 19)
- **3D & Animation:** Three.js, React Three Fiber, GSAP
- **Rendering:** Canvas 2D frame sequencing mapped to `window.requestAnimationFrame`.
- **Package Manager:** `pnpm` (Strictly enforced)

## ⚡ Setup & Development

**Important:** This repository strictly requires the use of `pnpm`. Running `npm install` or `npm ci` will throw engine mismatch and sync errors.

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd shipathon
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```
   *Note: If `pnpm` throws a warning about ignoring native build scripts (e.g. `sharp`), simply run `pnpm approve-builds` to authorize the compilation.*

3. **Run the development server**
   ```bash
   pnpm dev
   ```
   Navigate to `localhost:3000` to view the live site. Turbopack hot-reloading is configured by default.

## 🚢 Deployment

The project is natively configured for **GitHub Pages**. Any code securely pushed to the `main` branch will seamlessly trigger the `.github/workflows/nextjs.yml` pipeline, automatically resolving dependencies via `pnpm`, pulling cache artifacts, and deploying the optimized static bundle.

---
*Phaser is a Bits&Bytes vertical dedicated to robotics builders, hardware hackers, and makers — the community for people who build things you can hold.*

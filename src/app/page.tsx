import { Suspense } from 'react';
import Link from 'next/link';
import HeroSceneWrapper from '@/components/three/HeroSceneWrapper';
import styles from './page.module.css';

const features = [
  {
    icon: '🎬',
    title: 'Adaptive Video Streaming',
    desc: 'HLS.js with Web Worker-powered parsing, adaptive bitrate switching, and real-time buffer health monitoring for ultra-smooth playback.',
    tech: ['HLS.js', 'WebCodecs', 'ABR', 'MSE'],
    href: '/video',
  },
  {
    icon: '🎵',
    title: 'Audio Visualization',
    desc: 'Web Audio API AnalyserNode feeds real-time frequency data to a 3D waveform visualizer powered by React Three Fiber.',
    tech: ['Web Audio', 'Tone.js', 'FFT', 'R3F'],
    href: '/audio',
  },
  {
    icon: '🧊',
    title: '3D GPU Rendering',
    desc: 'InstancedMesh renders thousands of objects in a single draw call. Adaptive quality with PerformanceMonitor and on-demand frame rendering.',
    tech: ['Three.js', 'R3F', 'Instancing', 'WebGPU'],
    href: '/3d',
  },
  {
    icon: '📊',
    title: 'Performance Dashboard',
    desc: 'Real-time FPS, frame time, memory usage, and Core Web Vitals tracking with requestAnimationFrame precision.',
    tech: ['Web Vitals', 'RAF', 'Memory API'],
    href: '/dashboard',
  },
];

const stats = [
  { value: '60 FPS', label: 'Target Frame Rate' },
  { value: '<16ms', label: 'Frame Budget' },
  { value: '1 Draw', label: 'Instanced Calls' },
  { value: '100%', label: 'SEO Score' },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroCanvas}>
          <Suspense fallback={null}>
            <HeroSceneWrapper />
          </Suspense>
        </div>

        <div className={styles.heroContent}>
          <span className="badge animate-fade-in-up">
            ⚡ Performance-First Media Platform
          </span>
          <h1 className={`${styles.heroTitle} animate-fade-in-up delay-1`}>
            Stream. Render. <span className="gradient-text">Perform.</span>
          </h1>
          <p className={`${styles.heroSubtitle} animate-fade-in-up delay-2`}>
            Experience the cutting edge of browser performance — adaptive video streaming,
            real-time audio visualization, and GPU-accelerated 3D, all built with
            Next.js 15 streaming SSR for maximum SEO.
          </p>
          <div className={`${styles.heroActions} animate-fade-in-up delay-3`}>
            <Link href="/video" className="btn btn-primary">
              ▶ Video Streaming
            </Link>
            <Link href="/3d" className="btn btn-glass">
              🧊 3D Showcase
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────── */}
      <section className={styles.features}>
        <div className={styles.featuresInner}>
          <span className={styles.sectionLabel}>Capabilities</span>
          <h2 className={styles.sectionTitle}>
            Built for <span className="gradient-text">Raw Speed</span>
          </h2>

          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <Link
                key={f.title}
                href={f.href}
                className={`glass-card ${styles.featureCard} animate-fade-in-up delay-${i + 1}`}
              >
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
                <div className={styles.featureTech}>
                  {f.tech.map((t) => (
                    <span key={t} className={styles.techPill}>{t}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────── */}
      <section className={styles.statsSection}>
        <div className={styles.statsInner}>
          <span className={styles.sectionLabel}>Performance Targets</span>
          <h2 className={styles.statsTitle}>
            Every Millisecond <span className="gradient-text">Matters</span>
          </h2>

          <div className={styles.statsGrid}>
            {stats.map((s) => (
              <div key={s.label} className={`glass-card ${styles.statCard}`}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

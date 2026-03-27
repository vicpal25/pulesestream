import type { Metadata } from 'next';
import { Suspense } from 'react';
import DashboardMetricsWrapper from '@/components/performance/DashboardMetricsWrapper';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Performance Dashboard',
    description:
        'Real-time performance monitoring dashboard showing FPS, frame time, memory usage, and Core Web Vitals. Understand the architecture behind PulseStream\'s performance.',
    openGraph: {
        title: 'Performance Dashboard | PulseStream',
        description: 'Real-time performance metrics and architecture overview.',
    },
};

const architecture = [
    {
        title: 'Streaming SSR + React Server Components',
        desc: 'Page shells render on the server as HTML, streamed to the browser progressively via Suspense boundaries. SEO content is immediately available without JavaScript.',
        techs: ['Next.js 15', 'App Router', 'RSC', 'Streaming'],
    },
    {
        title: 'Dynamic Imports + Code Splitting',
        desc: 'Heavy client components (3D scenes, video player, audio visualizer) are dynamically imported with next/dynamic and ssr: false to prevent bloating the initial JS bundle.',
        techs: ['next/dynamic', 'React.lazy', 'Suspense'],
    },
    {
        title: 'InstancedMesh + Direct Mutations',
        desc: 'Particle systems use Three.js InstancedMesh to render thousands of objects in a single draw call. Animation updates happen via direct matrix mutations in useFrame — zero React re-renders.',
        techs: ['InstancedMesh', 'useFrame', 'Object3D'],
    },
    {
        title: 'HLS.js Worker Mode',
        desc: 'Video demuxing and parsing happens in a Web Worker, keeping the main thread free for rendering. Adaptive bitrate switching responds to network conditions automatically.',
        techs: ['HLS.js', 'Web Workers', 'ABR', 'MSE'],
    },
    {
        title: 'Web Audio API Pipeline',
        desc: 'AudioContext → Oscillators → BiquadFilter → GainNode → AnalyserNode. FFT data is extracted via getByteFrequencyData() and fed to 3D visualizers each frame.',
        techs: ['AudioContext', 'AnalyserNode', 'FFT'],
    },
    {
        title: 'CSS Modules + Zero Runtime',
        desc: 'All styling uses CSS Modules with CSS custom properties. No CSS-in-JS runtime — styles are extracted at build time for minimal overhead and no FOUC.',
        techs: ['CSS Modules', 'Custom Properties', 'No Runtime'],
    },
];

const tips = [
    {
        title: 'Minimize Draw Calls',
        desc: 'Use InstancedMesh for repeated geometry. Aim for under 100 draw calls per frame.',
    },
    {
        title: 'Avoid setState in useFrame',
        desc: 'Directly mutate object properties in the render loop. React state updates bypass the GPU pipeline.',
    },
    {
        title: 'Dynamic Import Heavy Components',
        desc: 'Keep 3D, video, and audio components out of the initial JS bundle using next/dynamic.',
    },
    {
        title: 'Use Server Components by Default',
        desc: 'Only promote to Client Components when interactivity is required. HTML is available to crawlers immediately.',
    },
    {
        title: 'Enable HLS Worker Mode',
        desc: 'Move demuxing off the main thread with enableWorker: true for smoother playback.',
    },
    {
        title: 'Limit DPR',
        desc: 'Cap device pixel ratio at 1.5 in R3F Canvas to prevent rendering at 4x resolution on Retina displays.',
    },
];

export default function DashboardPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <span className={`badge ${styles.badge}`}>📊 Performance Dashboard</span>
                <h1 className={styles.title}>
                    Real-Time <span className="gradient-text">Performance</span> Metrics
                </h1>
                <p className={styles.subtitle}>
                    Live monitoring of FPS, frame time, memory usage, and device capabilities.
                    Understand the architecture that makes PulseStream fast.
                </p>
            </header>

            {/* Live Metrics */}
            <Suspense
                fallback={
                    <div className={styles.metricsGrid}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`glass-card ${styles.metricCard}`}>
                                <div className="skeleton" style={{ width: 48, height: 48, margin: '0 auto 8px' }} />
                                <div className="skeleton" style={{ width: 80, height: 32, margin: '0 auto 8px' }} />
                                <div className="skeleton" style={{ width: 120, height: 12, margin: '0 auto' }} />
                            </div>
                        ))}
                    </div>
                }
            >
                <DashboardMetricsWrapper />
            </Suspense>

            {/* Architecture */}
            <section className={styles.archSection}>
                <h2>Architecture Deep Dive</h2>
                <div className={styles.archGrid}>
                    {architecture.map((arch) => (
                        <div key={arch.title} className={`glass-card ${styles.archCard}`}>
                            <div className={styles.archTitle}>{arch.title}</div>
                            <div className={styles.archDesc}>{arch.desc}</div>
                            <div className={styles.archTechs}>
                                {arch.techs.map((t) => (
                                    <span key={t} className={styles.archTech}>{t}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Performance Tips */}
            <section className={styles.tipsSection}>
                <h2>Performance Best Practices</h2>
                <div className={styles.tipsGrid}>
                    {tips.map((tip, i) => (
                        <div key={tip.title} className={`glass-card ${styles.tipCard}`}>
                            <span className={styles.tipNumber}>0{i + 1}</span>
                            <div className={styles.tipContent}>
                                <div className={styles.tipTitle}>{tip.title}</div>
                                <div className={styles.tipDesc}>{tip.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

import type { Metadata } from 'next';
import { Suspense } from 'react';
import AudioVisualizerWrapper from '@/components/audio/AudioVisualizerWrapper';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Audio Visualization',
    description:
        'Real-time 3D audio visualization powered by the Web Audio API AnalyserNode and React Three Fiber. Multiple visualization modes including frequency bars, circular, and waveform ring.',
    openGraph: {
        title: 'Audio Visualization | PulseStream',
        description: 'Immersive 3D audio visualization with Web Audio API.',
    },
};

const infoCards = [
    {
        icon: '🎛️',
        title: 'Web Audio API',
        desc: 'AnalyserNode provides real-time FFT frequency data at 60fps with configurable smoothing.',
    },
    {
        icon: '🧊',
        title: 'InstancedMesh Rendering',
        desc: '64 frequency bars rendered in a single draw call using Three.js InstancedMesh.',
    },
    {
        icon: '🎨',
        title: 'Dynamic HSL Colors',
        desc: 'Bar colors shift across the spectrum based on frequency amplitude using setColorAt().',
    },
];

export default function AudioPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <span className={`badge ${styles.badge}`}>🎵 Audio Visualization</span>
                <h1 className={styles.title}>
                    Real-Time <span className="gradient-text">Audio</span> Visualization
                </h1>
                <p className={styles.subtitle}>
                    Web Audio API feeds frequency data to 3D instanced geometry.
                    Press play to generate audio and watch the visualization respond.
                </p>
            </header>

            <Suspense
                fallback={
                    <div style={{
                        height: 500, background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-muted)',
                    }}>
                        Loading visualizer...
                    </div>
                }
            >
                <AudioVisualizerWrapper />
            </Suspense>

            <section className={styles.infoSection}>
                <h3>How It Works</h3>
                <div className={styles.infoGrid}>
                    {infoCards.map((card) => (
                        <div key={card.title} className={`glass-card ${styles.infoCard}`}>
                            <div className={styles.infoIcon}>{card.icon}</div>
                            <div className={styles.infoTitle}>{card.title}</div>
                            <div className={styles.infoDesc}>{card.desc}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

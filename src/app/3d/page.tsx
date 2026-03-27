import type { Metadata } from 'next';
import { Suspense } from 'react';
import Scene3DWrapper from '@/components/three/Scene3DWrapper';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: '3D GPU Rendering',
    description:
        'Interactive 3D scene with up to 50,000 particles rendered via InstancedMesh in a single draw call. Features orbit controls, adaptive quality, and wireframe geometry with metallic materials.',
    openGraph: {
        title: '3D GPU Rendering | PulseStream',
        description: 'GPU-accelerated 3D rendering with InstancedMesh and React Three Fiber.',
    },
};

const techCards = [
    {
        icon: '⚡',
        title: 'InstancedMesh Rendering',
        desc: 'Thousands of particles rendered in a single GPU draw call using Three.js InstancedMesh. Matrix and color updates happen directly in the render loop.',
        stat: '~3 draw calls for 50K objects',
    },
    {
        icon: '🧮',
        title: 'Direct Frame Mutations',
        desc: 'All animations use direct property mutations in useFrame — zero React re-renders during the render loop. Object3D matrices are batch-updated per frame.',
        stat: 'Zero setState in render loop',
    },
    {
        icon: '🎨',
        title: 'Dynamic HSL Coloring',
        desc: 'Each particle gets its own color via setColorAt(), shifting across the cyan-purple spectrum based on its animation phase.',
        stat: 'Per-instance color updates',
    },
    {
        icon: '🌐',
        title: 'Orbit Controls',
        desc: 'Smooth damped orbit controls with auto-rotation. Minimum and maximum distance constraints prevent clipping.',
        stat: 'dampingFactor: 0.05',
    },
];

export default function ThreeDPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <span className={`badge ${styles.badge}`}>🧊 3D GPU Rendering</span>
                <h1 className={styles.title}>
                    GPU-Accelerated <span className="gradient-text">3D Scene</span>
                </h1>
                <p className={styles.subtitle}>
                    Up to 50,000 particles in a single draw call. Orbit, zoom, and
                    explore the scene powered by React Three Fiber and Three.js.
                </p>
            </header>

            <Suspense
                fallback={
                    <div style={{
                        height: 600, background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-muted)',
                    }}>
                        Loading 3D scene...
                    </div>
                }
            >
                <Scene3DWrapper />
            </Suspense>

            <section className={styles.techSection}>
                <h3>Performance Techniques</h3>
                <div className={styles.techGrid}>
                    {techCards.map((card) => (
                        <div key={card.title} className={`glass-card ${styles.techCard}`}>
                            <div className={styles.techIcon}>{card.icon}</div>
                            <div className={styles.techTitle}>{card.title}</div>
                            <div className={styles.techDesc}>{card.desc}</div>
                            <div className={styles.techStat}>{card.stat}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

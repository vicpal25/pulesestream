import type { Metadata } from 'next';
import { Suspense } from 'react';
import VideoPlayerWrapper from '@/components/video/VideoPlayerWrapper';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Video Streaming',
    description:
        'Adaptive bitrate video streaming with HLS.js, Web Worker parsing, and real-time performance metrics including bitrate, buffer health, and quality level monitoring.',
    openGraph: {
        title: 'Video Streaming | PulseStream',
        description: 'HLS adaptive bitrate streaming with live performance stats.',
    },
};

export default function VideoPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <span className={`badge ${styles.badge}`}>🎬 Video Streaming</span>
                <h1 className={styles.title}>
                    Adaptive Bitrate <span className="gradient-text">Streaming</span>
                </h1>
                <p className={styles.subtitle}>
                    HLS.js with Web Worker parsing, adaptive quality switching, and
                    real-time metrics. Select a stream below and watch the stats update live.
                </p>
            </header>

            <Suspense
                fallback={
                    <div className={styles.playerWrapper}>
                        <div className={styles.video} style={{ background: 'var(--bg-secondary)' }}>
                            <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading player...</div>
                        </div>
                    </div>
                }
            >
                <VideoPlayerWrapper />
            </Suspense>
        </div>
    );
}

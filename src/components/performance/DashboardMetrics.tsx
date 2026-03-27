'use client';

import { usePerformance } from '@/hooks/usePerformance';
import styles from './DashboardMetrics.module.css';

export default function DashboardMetrics() {
    const metrics = usePerformance(true);

    const fpsPercent = Math.min((metrics.fps / 60) * 100, 100);
    const frameTimePercent = Math.min((metrics.frameTime / 33) * 100, 100);

    return (
        <div className={styles.metricsGrid}>
            <div className={`glass-card ${styles.metricCard}`}>
                <div className={styles.metricIcon}>🎯</div>
                <div className={`${styles.metricValue} ${metrics.fps >= 55 ? styles.metricValueGood :
                    metrics.fps >= 30 ? styles.metricValueWarn : styles.metricValueBad
                    }`}>
                    {metrics.fps}
                </div>
                <div className={styles.metricLabel}>Frames Per Second</div>
                <div className={styles.metricBar}>
                    <div
                        className={styles.metricBarFill}
                        style={{
                            width: `${fpsPercent}%`,
                            background: metrics.fps >= 55 ? 'var(--accent-green)' :
                                metrics.fps >= 30 ? 'var(--accent-orange)' : 'var(--accent-pink)',
                        }}
                    />
                </div>
            </div>

            <div className={`glass-card ${styles.metricCard}`}>
                <div className={styles.metricIcon}>⏱️</div>
                <div className={`${styles.metricValue} ${metrics.frameTime <= 16.67 ? styles.metricValueGood :
                    metrics.frameTime <= 33 ? styles.metricValueWarn : styles.metricValueBad
                    }`}>
                    {metrics.frameTime.toFixed(1)}
                </div>
                <div className={styles.metricLabel}>Frame Time (ms)</div>
                <div className={styles.metricBar}>
                    <div
                        className={styles.metricBarFill}
                        style={{
                            width: `${100 - frameTimePercent}%`,
                            background: metrics.frameTime <= 16.67 ? 'var(--accent-green)' :
                                metrics.frameTime <= 33 ? 'var(--accent-orange)' : 'var(--accent-pink)',
                        }}
                    />
                </div>
            </div>

            <div className={`glass-card ${styles.metricCard}`}>
                <div className={styles.metricIcon}>💾</div>
                <div className={`${styles.metricValue} ${styles.metricValueGood}`}>
                    {metrics.memoryUsed || '—'}
                </div>
                <div className={styles.metricLabel}>Memory Used (MB)</div>
                <div className={styles.metricBar}>
                    <div
                        className={styles.metricBarFill}
                        style={{
                            width: metrics.memoryTotal ? `${(metrics.memoryUsed / metrics.memoryTotal) * 100}%` : '0%',
                            background: 'var(--accent-blue)',
                        }}
                    />
                </div>
            </div>

            <div className={`glass-card ${styles.metricCard}`}>
                <div className={styles.metricIcon}>🖥️</div>
                <div className={`${styles.metricValue} ${styles.metricValueGood}`}>
                    {typeof window !== 'undefined' ? window.devicePixelRatio.toFixed(1) : '—'}
                </div>
                <div className={styles.metricLabel}>Device Pixel Ratio</div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useMediaStream } from '@/hooks/useMediaStream';
import styles from './VideoPlayer.module.css';

const streams = [
    {
        name: 'Big Buck Bunny',
        desc: 'Classic animation demo — multiple quality levels, ABR switching',
        src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    },
    {
        name: 'Sintel (4K)',
        desc: 'Open movie — high-resolution progressive streaming',
        src: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    },
    {
        name: 'Tears of Steel',
        desc: 'Short film — multi-bitrate HLS with adaptive switching',
        src: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    },
];

export default function VideoPlayer() {
    const [activeStream, setActiveStream] = useState(0);
    const {
        videoRef,
        isPlaying,
        stats,
        qualityLevels,
        error,
        play,
        pause,
        setQuality,
    } = useMediaStream(streams[activeStream].src, { autoPlay: false });

    return (
        <>
            {/* Player */}
            <div className={styles.playerWrapper}>
                <video
                    ref={videoRef}
                    className={styles.video}
                    playsInline
                    muted
                />
                <div className={styles.controls}>
                    <button className={styles.playBtn} onClick={isPlaying ? pause : play}>
                        {isPlaying ? '⏸' : '▶'}
                    </button>

                    <select
                        className={styles.qualitySelect}
                        value={stats.level}
                        onChange={(e) => setQuality(Number(e.target.value))}
                    >
                        <option value={-1}>Auto</option>
                        {qualityLevels.map((q, i) => (
                            <option key={i} value={i}>
                                {q.height}p ({Math.round(q.bitrate / 1000)} kbps)
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && <div className={styles.errorMsg}>{error}</div>}

            {/* Live Stats */}
            <div className={styles.statsPanel}>
                <div className={`glass-card ${styles.statCard}`}>
                    <div className={styles.statLabel}>Bitrate</div>
                    <div className={styles.statValue}>
                        {stats.bitrate}<span className={styles.statUnit}>kbps</span>
                    </div>
                </div>
                <div className={`glass-card ${styles.statCard}`}>
                    <div className={styles.statLabel}>Resolution</div>
                    <div className={styles.statValue}>{stats.resolution}</div>
                </div>
                <div className={`glass-card ${styles.statCard}`}>
                    <div className={styles.statLabel}>Buffer</div>
                    <div className={styles.statValue}>
                        {stats.buffer}<span className={styles.statUnit}>s</span>
                    </div>
                </div>
                <div className={`glass-card ${styles.statCard}`}>
                    <div className={styles.statLabel}>Quality Levels</div>
                    <div className={styles.statValue}>{stats.levels}</div>
                </div>
            </div>

            {/* Stream Selector */}
            <div className={styles.streamSection}>
                <h3>Available Streams</h3>
                <div className={styles.streamGrid}>
                    {streams.map((s, i) => (
                        <div
                            key={s.name}
                            className={`glass-card ${styles.streamCard} ${i === activeStream ? styles.streamCardActive : ''
                                }`}
                            onClick={() => setActiveStream(i)}
                        >
                            <div className={styles.streamName}>{s.name}</div>
                            <div className={styles.streamDesc}>{s.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

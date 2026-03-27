'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';

interface StreamStats {
    bitrate: number;
    resolution: string;
    buffer: number;
    latency: number;
    level: number;
    levels: number;
}

interface UseMediaStreamOptions {
    autoPlay?: boolean;
}

export function useMediaStream(src: string, options: UseMediaStreamOptions = {}) {
    const { autoPlay = false } = options;
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [isPlaying, setPlaying] = useState(false);
    const [stats, setStats] = useState<StreamStats>({
        bitrate: 0,
        resolution: '—',
        buffer: 0,
        latency: 0,
        level: -1,
        levels: 0,
    });
    const [qualityLevels, setQualityLevels] = useState<{ height: number; bitrate: number }[]>([]);
    const [error, setError] = useState<string | null>(null);

    const attachHls = useCallback(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        // Cleanup previous
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 30,
            });
            hlsRef.current = hls;

            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
                const levels = data.levels.map((l) => ({
                    height: l.height,
                    bitrate: l.bitrate,
                }));
                setQualityLevels(levels);
                setStats((s) => ({ ...s, levels: levels.length }));
                if (autoPlay) video.play().catch(() => { });
            });

            hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
                const level = hls.levels[data.level];
                if (level) {
                    setStats((s) => ({
                        ...s,
                        level: data.level,
                        bitrate: Math.round(level.bitrate / 1000),
                        resolution: `${level.width}×${level.height}`,
                    }));
                }
            });

            hls.on(Hls.Events.ERROR, (_event, data) => {
                if (data.fatal) {
                    setError(`HLS Error: ${data.type}`);
                    hls.destroy();
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari native HLS
            video.src = src;
            if (autoPlay) video.play().catch(() => { });
        } else {
            setError('HLS is not supported in this browser');
        }
    }, [src, autoPlay]);

    // Update buffer stats periodically
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const interval = setInterval(() => {
            if (video.buffered.length > 0) {
                const buffered = video.buffered.end(video.buffered.length - 1) - video.currentTime;
                setStats((s) => ({
                    ...s,
                    buffer: Math.round(buffered * 100) / 100,
                    latency: hlsRef.current?.latency ? Math.round(hlsRef.current.latency * 100) / 100 : 0,
                }));
            }
        }, 500);

        return () => clearInterval(interval);
    }, [isPlaying]);

    useEffect(() => {
        attachHls();
        return () => {
            hlsRef.current?.destroy();
        };
    }, [attachHls]);

    const play = useCallback(() => {
        videoRef.current?.play().then(() => setPlaying(true)).catch(() => { });
    }, []);

    const pause = useCallback(() => {
        videoRef.current?.pause();
        setPlaying(false);
    }, []);

    const setQuality = useCallback((level: number) => {
        if (hlsRef.current) {
            hlsRef.current.currentLevel = level; // -1 for auto
        }
    }, []);

    return {
        videoRef,
        isPlaying,
        stats,
        qualityLevels,
        error,
        play,
        pause,
        setQuality,
    };
}

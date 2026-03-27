'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface PerformanceMetrics {
    fps: number;
    frameTime: number;
    memoryUsed: number;
    memoryTotal: number;
}

export function usePerformance(enabled = true): PerformanceMetrics {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fps: 0,
        frameTime: 0,
        memoryUsed: 0,
        memoryTotal: 0,
    });

    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());
    const lastFrameTimeRef = useRef(performance.now());

    const tick = useCallback(() => {
        if (!enabled) return;

        frameCountRef.current++;
        const now = performance.now();
        const frameTime = now - lastFrameTimeRef.current;
        lastFrameTimeRef.current = now;

        if (now - lastTimeRef.current >= 1000) {
            const perf = (performance as unknown as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } });

            setMetrics({
                fps: frameCountRef.current,
                frameTime: Math.round(frameTime * 100) / 100,
                memoryUsed: perf.memory ? Math.round(perf.memory.usedJSHeapSize / 1048576) : 0,
                memoryTotal: perf.memory ? Math.round(perf.memory.totalJSHeapSize / 1048576) : 0,
            });

            frameCountRef.current = 0;
            lastTimeRef.current = now;
        }
    }, [enabled]);

    useEffect(() => {
        if (!enabled) return;
        let rafId: number;
        const loop = () => {
            tick();
            rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafId);
    }, [enabled, tick]);

    return metrics;
}

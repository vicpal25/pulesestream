'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import styles from '../../app/audio/page.module.css';

type VisualizationMode = 'bars' | 'circular' | 'waveform';

export default function AudioVisualizer() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);
    const oscRefs = useRef<OscillatorNode[]>([]);

    const [isPlaying, setIsPlaying] = useState(false);
    const [mode, setMode] = useState<VisualizationMode>('bars');
    const [volume, setVolume] = useState(0.3);
    const [status, setStatus] = useState('Ready');

    // ── Three.js scene refs ───────────────────
    const sceneRef = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        bars: THREE.InstancedMesh | null;
        waveformLine: THREE.Line | null;
        dummy: THREE.Object3D;
        color: THREE.Color;
        frameId: number;
        dataArray: Uint8Array;
    } | null>(null);

    const initThree = useCallback((binCount: number) => {
        const container = canvasRef.current;
        if (!container) return;

        // Cleanup
        if (sceneRef.current) {
            cancelAnimationFrame(sceneRef.current.frameId);
            sceneRef.current.renderer.dispose();
            if (container.contains(sceneRef.current.renderer.domElement)) {
                container.removeChild(sceneRef.current.renderer.domElement);
            }
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 2, mode === 'circular' ? 10 : 8);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x0a0a1a);
        container.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        const pLight = new THREE.PointLight(0x00e5ff, 2, 20);
        pLight.position.set(0, 5, 5);
        scene.add(pLight);

        const dummy = new THREE.Object3D();
        const color = new THREE.Color();
        const dataArray = new Uint8Array(binCount);
        let bars: THREE.InstancedMesh | null = null;
        let waveformLine: THREE.Line | null = null;

        if (mode === 'waveform') {
            const lineGeo = new THREE.BufferGeometry();
            const positions = new Float32Array(binCount * 3);
            lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const lineMat = new THREE.LineBasicMaterial({ color: 0x00e5ff });
            waveformLine = new THREE.Line(lineGeo, lineMat);
            scene.add(waveformLine);
        } else {
            const barCount = 64;
            const barGeo = new THREE.BoxGeometry(0.1, 1, 0.1);
            const barMat = new THREE.MeshStandardMaterial({ metalness: 0.5, roughness: 0.3 });
            bars = new THREE.InstancedMesh(barGeo, barMat, barCount);

            for (let i = 0; i < barCount; i++) {
                if (mode === 'circular') {
                    const angle = (i / barCount) * Math.PI * 2;
                    const radius = 3;
                    dummy.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
                    dummy.rotation.y = -angle;
                } else {
                    dummy.position.set((i - barCount / 2) * 0.18, 0, 0);
                }
                dummy.scale.set(1, 0.01, 1);
                dummy.updateMatrix();
                bars.setMatrixAt(i, dummy.matrix);
                color.setHSL(i / barCount, 0.8, 0.6);
                bars.setColorAt(i, color);
            }
            bars.instanceMatrix.needsUpdate = true;
            if (bars.instanceColor) bars.instanceColor.needsUpdate = true;
            scene.add(bars);
        }

        let frameId = 0;

        const animate = () => {
            frameId = requestAnimationFrame(animate);

            if (analyserRef.current) {
                analyserRef.current.getByteFrequencyData(dataArray);
            }

            if (mode === 'waveform' && waveformLine) {
                const positions = waveformLine.geometry.attributes.position as THREE.BufferAttribute;
                for (let i = 0; i < binCount; i++) {
                    const x = (i / binCount) * 12 - 6;
                    const y = (dataArray[i] / 255) * 3 - 1;
                    const angle = (i / binCount) * Math.PI * 2;
                    const radius = 2 + (dataArray[i] / 255) * 2;
                    positions.setXYZ(i, Math.cos(angle) * radius, y * 0.5, Math.sin(angle) * radius);
                }
                positions.needsUpdate = true;
            } else if (bars) {
                const barCount = 64;
                for (let i = 0; i < barCount; i++) {
                    const bin = Math.floor((i / barCount) * dataArray.length);
                    const amplitude = dataArray[bin] / 255;
                    const scaleY = Math.max(0.01, amplitude * 4);

                    if (mode === 'circular') {
                        const angle = (i / barCount) * Math.PI * 2;
                        const radius = 3;
                        dummy.position.set(Math.cos(angle) * radius, scaleY * 0.5, Math.sin(angle) * radius);
                        dummy.rotation.y = -angle;
                    } else {
                        dummy.position.set((i - barCount / 2) * 0.18, scaleY * 0.5, 0);
                    }
                    dummy.scale.set(1, scaleY, 1);
                    dummy.updateMatrix();
                    bars.setMatrixAt(i, dummy.matrix);

                    color.setHSL(0.5 + amplitude * 0.3, 0.8, 0.4 + amplitude * 0.3);
                    bars.setColorAt(i, color);
                }
                bars.instanceMatrix.needsUpdate = true;
                if (bars.instanceColor) bars.instanceColor.needsUpdate = true;
            }

            renderer.render(scene, camera);
        };
        animate();

        sceneRef.current = { scene, camera, renderer, bars, waveformLine, dummy, color, frameId, dataArray };

        const onResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [mode]);

    // ── Audio Control ─────────────────────────
    const startAudio = useCallback(async () => {
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        const gain = ctx.createGain();
        gain.gain.value = volume;
        gainRef.current = gain;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000;

        // Create oscillators
        const frequencies = [110, 220, 330, 440, 550];
        const oscillators = frequencies.map((freq) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;

            const lfo = ctx.createOscillator();
            lfo.frequency.value = 0.5 + Math.random() * 2;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = freq * 0.1;

            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();

            osc.connect(filter);
            return osc;
        });

        filter.connect(gain);
        gain.connect(analyser);
        analyser.connect(ctx.destination);

        oscillators.forEach((osc) => osc.start());
        oscRefs.current = oscillators;

        setIsPlaying(true);
        setStatus('Playing — generating audio');

        // Init three.js visualization with analyser's frequency bin count
        initThree(analyser.frequencyBinCount);
    }, [volume, initThree]);

    const stopAudio = useCallback(() => {
        oscRefs.current.forEach((osc) => {
            try { osc.stop(); } catch { /* already stopped */ }
        });
        oscRefs.current = [];
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
        analyserRef.current = null;

        setIsPlaying(false);
        setStatus('Stopped');
    }, []);

    useEffect(() => {
        if (gainRef.current) {
            gainRef.current.gain.value = volume;
        }
    }, [volume]);

    useEffect(() => {
        // Init Three.js with default bin count on mode change when playing
        if (isPlaying && analyserRef.current) {
            initThree(analyserRef.current.frequencyBinCount);
        } else {
            initThree(128);
        }
    }, [mode, isPlaying, initThree]);

    useEffect(() => {
        return () => {
            stopAudio();
            if (sceneRef.current) {
                cancelAnimationFrame(sceneRef.current.frameId);
                sceneRef.current.renderer.dispose();
            }
        };
    }, [stopAudio]);

    return (
        <>
            <div ref={canvasRef} style={{
                width: '100%', height: 500, borderRadius: 'var(--radius-lg)',
                overflow: 'hidden', border: '1px solid var(--glass-border)',
                position: 'relative',
            }} />

            {/* Controls */}
            <div className={styles.controlsSection}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                        className="btn btn-primary"
                        onClick={isPlaying ? stopAudio : startAudio}
                    >
                        {isPlaying ? '⏹ Stop' : '▶ Play'}
                    </button>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {(['bars', 'circular', 'waveform'] as VisualizationMode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`btn ${m === mode ? 'btn-primary' : 'btn-glass'}`}
                                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vol:</span>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            style={{ width: 100 }}
                        />
                    </div>

                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {status}
                    </span>
                </div>
            </div>
        </>
    );
}

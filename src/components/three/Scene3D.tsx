'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type Shape = 'torusKnot' | 'icosahedron' | 'dodecahedron';

function createCentralGeometry(shape: Shape): THREE.BufferGeometry {
    switch (shape) {
        case 'icosahedron':
            return new THREE.IcosahedronGeometry(1.5, 2);
        case 'dodecahedron':
            return new THREE.DodecahedronGeometry(1.5, 1);
        default:
            return new THREE.TorusKnotGeometry(1.2, 0.4, 128, 32);
    }
}

export default function Scene3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        particles: THREE.InstancedMesh;
        centralMesh: THREE.Mesh;
        controls: OrbitControls;
        dummy: THREE.Object3D;
        particleData: { x: number; y: number; z: number; speed: number; phase: number }[];
        color: THREE.Color;
        frameId: number;
        clock: THREE.Clock;
    } | null>(null);

    const [particleCount, setParticleCount] = useState(5000);
    const [shape, setShape] = useState<Shape>('torusKnot');
    const [drawCalls, setDrawCalls] = useState(0);

    const initScene = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        // Clean up previous scene
        if (sceneRef.current) {
            cancelAnimationFrame(sceneRef.current.frameId);
            sceneRef.current.renderer.dispose();
            sceneRef.current.controls.dispose();
            if (container.contains(sceneRef.current.renderer.domElement)) {
                container.removeChild(sceneRef.current.renderer.domElement);
            }
        }

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0a0a1a, 0.035);

        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 2, 12);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x0a0a1a);
        container.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.minDistance = 5;
        controls.maxDistance = 30;

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const dirLight = new THREE.DirectionalLight(0x00e5ff, 0.8);
        dirLight.position.set(10, 10, 5);
        scene.add(dirLight);
        const pointLight = new THREE.PointLight(0xa855f7, 1, 20);
        pointLight.position.set(-5, 5, -5);
        scene.add(pointLight);

        // Central geometry
        const centralGeo = createCentralGeometry(shape);
        const centralMat = new THREE.MeshPhysicalMaterial({
            color: 0x00e5ff,
            metalness: 0.8,
            roughness: 0.2,
            wireframe: true,
            transparent: true,
            opacity: 0.6,
        });
        const centralMesh = new THREE.Mesh(centralGeo, centralMat);
        scene.add(centralMesh);

        // Particles
        const particleGeo = new THREE.SphereGeometry(0.03, 4, 4);
        const particleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const particles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);

        const dummy = new THREE.Object3D();
        const color = new THREE.Color();
        const particleData: { x: number; y: number; z: number; speed: number; phase: number }[] = [];

        for (let i = 0; i < particleCount; i++) {
            const radius = 3 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            particleData.push({ x, y, z, speed: 0.1 + Math.random() * 0.4, phase: Math.random() * Math.PI * 2 });
            dummy.position.set(x, y, z);
            dummy.updateMatrix();
            particles.setMatrixAt(i, dummy.matrix);

            const hue = 0.5 + (i / particleCount) * 0.15;
            color.setHSL(hue, 0.8, 0.6);
            particles.setColorAt(i, color);
        }
        particles.instanceMatrix.needsUpdate = true;
        if (particles.instanceColor) particles.instanceColor.needsUpdate = true;
        scene.add(particles);

        // Stars background
        const starGeo = new THREE.BufferGeometry();
        const starPositions = new Float32Array(2000 * 3);
        for (let i = 0; i < 2000; i++) {
            starPositions[i * 3] = (Math.random() - 0.5) * 80;
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
            starPositions[i * 3 + 2] = -Math.random() * 50;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, sizeAttenuation: true })));

        const clock = new THREE.Clock();
        let frameId = 0;

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            controls.update();

            // Animate central
            centralMesh.rotation.x = t * 0.2;
            centralMesh.rotation.y = t * 0.15;

            // Animate particles
            for (let i = 0; i < particleCount; i++) {
                const d = particleData[i];
                dummy.position.set(
                    d.x + Math.sin(t * d.speed + d.phase) * 0.5,
                    d.y + Math.cos(t * d.speed + d.phase * 1.3) * 0.3,
                    d.z + Math.sin(t * d.speed * 0.6 + d.phase * 0.7) * 0.4,
                );
                const scale = 0.5 + Math.sin(t * d.speed + d.phase) * 0.3;
                dummy.scale.setScalar(scale);
                dummy.updateMatrix();
                particles.setMatrixAt(i, dummy.matrix);
            }
            particles.instanceMatrix.needsUpdate = true;

            renderer.render(scene, camera);
            setDrawCalls(renderer.info.render.calls);
        };
        animate();

        sceneRef.current = { scene, camera, renderer, particles, centralMesh, controls, dummy, particleData, color, frameId, clock };

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
            controls.dispose();
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [particleCount, shape]);

    useEffect(() => {
        const cleanup = initScene();
        return () => cleanup?.();
    }, [initScene]);

    return (
        <>
            <div style={{ position: 'relative', width: '100%', height: 600, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                {/* Stats overlay */}
                <div style={{
                    position: 'absolute', top: 12, right: 12, zIndex: 10,
                    padding: '8px 14px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                    borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)',
                }}>
                    <div>Particles: <span style={{ color: 'var(--accent-cyan)' }}>{particleCount.toLocaleString()}</span></div>
                    <div>Draw Calls: <span style={{ color: 'var(--accent-green)' }}>{drawCalls}</span></div>
                </div>

                <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Particles:</label>
                    {[1000, 5000, 10000, 25000, 50000].map((count) => (
                        <button
                            key={count}
                            onClick={() => setParticleCount(count)}
                            className={`btn ${count === particleCount ? 'btn-primary' : 'btn-glass'}`}
                            style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                        >
                            {count >= 1000 ? `${count / 1000}K` : count}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Shape:</label>
                    {(['torusKnot', 'icosahedron', 'dodecahedron'] as Shape[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => setShape(s)}
                            className={`btn ${s === shape ? 'btn-primary' : 'btn-glass'}`}
                            style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

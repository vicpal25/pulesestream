'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // ── Setup ───────────────────────────────
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        container.appendChild(renderer.domElement);

        // ── Lights ──────────────────────────────
        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        const pointLight = new THREE.PointLight(0x00e5ff, 2, 20);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);
        const pointLight2 = new THREE.PointLight(0xa855f7, 1.5, 15);
        pointLight2.position.set(-5, -3, 3);
        scene.add(pointLight2);

        // ── Particle Cloud (InstancedMesh) ──────
        const PARTICLE_COUNT = 2000;
        const particleGeo = new THREE.SphereGeometry(0.02, 6, 6);
        const particleMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.7 });
        const particles = new THREE.InstancedMesh(particleGeo, particleMat, PARTICLE_COUNT);

        const dummy = new THREE.Object3D();
        const particleData: { x: number; y: number; z: number; speed: number }[] = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const x = (Math.random() - 0.5) * 16;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;
            particleData.push({ x, y, z, speed: 0.3 + Math.random() * 0.5 });
            dummy.position.set(x, y, z);
            dummy.updateMatrix();
            particles.setMatrixAt(i, dummy.matrix);
        }
        particles.instanceMatrix.needsUpdate = true;
        scene.add(particles);

        // ── Floating geometries ─────────────────
        const torusMat = new THREE.MeshStandardMaterial({
            color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.4,
        });
        const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(1.2, 0.35, 100, 16), torusMat);
        torus.position.set(-3, 1, -2);
        scene.add(torus);

        const icoMat = new THREE.MeshStandardMaterial({
            color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.35,
        });
        const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 1), icoMat);
        ico.position.set(3.5, -1, -1.5);
        scene.add(ico);

        // ── Stars ────────────────────────────────
        const starGeo = new THREE.BufferGeometry();
        const starCount = 1500;
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            starPositions[i * 3] = (Math.random() - 0.5) * 100;
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            starPositions[i * 3 + 2] = -Math.random() * 50;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, sizeAttenuation: true });
        scene.add(new THREE.Points(starGeo, starMat));

        // ── Animation Loop ──────────────────────
        let frameId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            // Animate particles
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const d = particleData[i];
                dummy.position.set(
                    d.x + Math.sin(t * d.speed + i) * 0.3,
                    d.y + Math.cos(t * d.speed + i * 0.7) * 0.2,
                    d.z + Math.sin(t * d.speed * 0.5 + i * 0.3) * 0.2,
                );
                dummy.updateMatrix();
                particles.setMatrixAt(i, dummy.matrix);
            }
            particles.instanceMatrix.needsUpdate = true;

            // Rotate geometries
            torus.rotation.x = t * 0.3;
            torus.rotation.y = t * 0.2;
            ico.rotation.x = t * 0.4;
            ico.rotation.z = t * 0.25;

            renderer.render(scene, camera);
        };
        animate();

        // ── Resize handler ──────────────────────
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
            particleGeo.dispose();
            particleMat.dispose();
            torusMat.dispose();
            icoMat.dispose();
            starGeo.dispose();
            starMat.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        />
    );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

const routes = [
  { path: '/', label: 'Home' },
  { path: '/video', label: 'Video' },
  { path: '/audio', label: 'Audio' },
  { path: '/3d', label: '3D' },
  { path: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Simple FPS counter for the nav badge
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

    const tick = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          PulseStream
        </Link>

        <ul className={`${styles.links} ${mobileOpen ? styles.linksOpen : ''}`}>
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className={`${styles.link} ${
                  pathname === route.path ? styles.linkActive : ''
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.perfBadge}>
          <span className={styles.perfDot} />
          {fps} FPS
        </div>

        <button
          className={styles.mobileToggle}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}

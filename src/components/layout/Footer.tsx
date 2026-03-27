import styles from './Footer.module.css';

const techStack = [
    'Next.js 15', 'React 19', 'TypeScript', 'Three.js',
    'R3F', 'WebGPU', 'HLS.js', 'Web Audio', 'Streaming SSR',
];

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                <div className={styles.brand}>
                    <span className={styles.brandName}>⚡ PulseStream</span>
                    <span className={styles.brandDesc}>
                        High-performance media streaming & 3D rendering
                    </span>
                </div>
                <div className={styles.techStack}>
                    {techStack.map((tech) => (
                        <span key={tech} className={styles.techTag}>
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </footer>
    );
}

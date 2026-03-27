import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'PulseStream — High-Performance Media Streaming & 3D',
    template: '%s | PulseStream',
  },
  description:
    'Next-gen browser platform showcasing high-performance video streaming (HLS + WebCodecs), immersive audio visualization (Web Audio API), and GPU-accelerated 3D rendering (React Three Fiber + WebGPU). Built with Next.js 15 streaming SSR for maximum SEO.',
  keywords: [
    'WebGPU', 'WebCodecs', 'HLS streaming', 'React Three Fiber', 'Three.js',
    'Web Audio API', 'Next.js 15', 'streaming SSR', 'performance', '3D rendering',
  ],
  openGraph: {
    title: 'PulseStream — High-Performance Media Platform',
    description: 'Audio, Video & 3D rendering with cutting-edge browser APIs.',
    type: 'website',
    locale: 'en_US',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PulseStream',
  description:
    'High-performance media streaming and 3D rendering platform built with the latest browser APIs.',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Navbar />
        <main style={{ paddingTop: '72px', minHeight: '100vh' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

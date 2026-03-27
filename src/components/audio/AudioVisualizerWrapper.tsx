'use client';

import dynamic from 'next/dynamic';

const AudioVisualizer = dynamic(
    () => import('@/components/audio/AudioVisualizer'),
    { ssr: false }
);

export default function AudioVisualizerWrapper() {
    return <AudioVisualizer />;
}

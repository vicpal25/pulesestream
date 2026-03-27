'use client';

import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(
    () => import('@/components/video/VideoPlayer'),
    { ssr: false }
);

export default function VideoPlayerWrapper() {
    return <VideoPlayer />;
}

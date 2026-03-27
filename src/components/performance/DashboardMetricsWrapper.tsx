'use client';

import dynamic from 'next/dynamic';

const DashboardMetrics = dynamic(
    () => import('@/components/performance/DashboardMetrics'),
    { ssr: false }
);

export default function DashboardMetricsWrapper() {
    return <DashboardMetrics />;
}

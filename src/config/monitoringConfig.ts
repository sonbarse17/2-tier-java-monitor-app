import type { MonitoredMetricConfig, AlertThreshold, TimeWindowOption } from '@/types';
import { Cpu, Database, Users, Activity, BarChartHorizontalBig, LayoutDashboard, BrainCircuit, Settings2 } from 'lucide-react';

export const MONITORING_INTERVAL_MS: number = 15000; // 15 seconds for mock data updates

export const METRICS_CONFIG: MonitoredMetricConfig[] = [
  { id: 'heapUsage', name: 'Heap Usage', unit: 'MB', icon: Database, historical: true },
  { id: 'threadCount', name: 'Thread Count', unit: '', icon: Users, historical: true },
  { id: 'cpuUtilization', name: 'CPU Utilization', unit: '%', icon: Cpu, historical: true },
  { id: 'gcActivity', name: 'GC Activity', unit: 'ms/sec', icon: Activity, historical: false }, // Example of non-historical
];

export const CHART_TIME_WINDOWS: TimeWindowOption[] = [
  { label: 'Last 5 Minutes', value: '5m' },
  { label: 'Last 15 Minutes', value: '15m' },
  { label: 'Last Hour', value: '1h' },
  { label: 'Last 6 Hours', value: '6h' },
];
export const DEFAULT_CHART_TIME_WINDOW: string = '15m';

export const ALERT_THRESHOLDS: Record<string, AlertThreshold> = {
  heapUsage: { warning: 500, critical: 750 }, // Example: MB
  threadCount: { warning: 100, critical: 200 },
  cpuUtilization: { warning: 70, critical: 90 }, // Example: %
  gcActivity: { warning: 100, critical: 200 },
};

export const APP_NAME = "JavaMonitor";

// Icons for different sections/purposes
export const Icons = {
  dashboard: LayoutDashboard,
  heap: Database,
  threads: Users,
  cpu: Cpu,
  aiInsights: BrainCircuit,
  charts: BarChartHorizontalBig,
  settings: Settings2,
}

// Helper to get a specific metric config
export const getMetricConfig = (id: MonitoredMetricConfig['id']): MonitoredMetricConfig | undefined => {
  return METRICS_CONFIG.find(m => m.id === id);
};

// Placeholder for actual application server identification
export const MONITORED_APP_SERVER_ID = "prod-app-server-01";

import type { LucideIcon } from 'lucide-react';

export interface JvmMetricValue {
  heapUsage: number;
  threadCount: number;
  cpuUtilization: number;
  [key: string]: number; // For other potential numeric metrics
}

export interface JvmMetric extends MonitoredMetricConfig {
  value: number | string; // Can be string for formatted values
  currentNumericValue: number; // Raw numeric value for calculations/AI
}

export interface HistoricalDataPoint {
  timestamp: string; // Typically ISO string or formatted date string
  value: number;
}

export interface MetricHistory {
  metricId: MonitoredMetricConfig['id'];
  data: HistoricalDataPoint[];
}

export interface TimeWindowOption {
  label: string;
  value: string;
}

export interface MonitoredMetricConfig {
  id: 'heapUsage' | 'threadCount' | 'cpuUtilization' | string; // Allow string for future expansion
  name: string;
  unit: string;
  icon: LucideIcon;
  historical?: boolean;
}

export interface AlertThreshold {
  warning: number;
  critical: number;
}

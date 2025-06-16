import type { JvmMetric, HistoricalDataPoint, MetricHistory, JvmMetricValue } from '@/types';
import { METRICS_CONFIG, CHART_TIME_WINDOWS, DEFAULT_CHART_TIME_WINDOW } from '@/config/monitoringConfig';
import { subMinutes, subHours, formatISO } from 'date-fns';

let lastMetricValues: JvmMetricValue = {
  heapUsage: 250,
  threadCount: 50,
  cpuUtilization: 30,
  gcActivity: 10,
};

export const generateMockJvmMetrics = (): JvmMetric[] => {
  const newValues: JvmMetricValue = {
    heapUsage: lastMetricValues.heapUsage + (Math.random() * 20 - 10), // Fluctuate heap
    threadCount: lastMetricValues.threadCount + (Math.random() * 4 - 2), // Fluctuate threads
    cpuUtilization: Math.min(100, Math.max(0, lastMetricValues.cpuUtilization + (Math.random() * 10 - 5))), // Fluctuate CPU
    gcActivity: Math.max(0, lastMetricValues.gcActivity + (Math.random() * 5 - 2.5)), // Fluctuate GC
  };

  // Ensure values are within reasonable bounds
  newValues.heapUsage = Math.max(50, Math.min(1000, newValues.heapUsage));
  newValues.threadCount = Math.max(10, Math.min(150, Math.round(newValues.threadCount)));
  newValues.cpuUtilization = Math.round(newValues.cpuUtilization * 10) / 10; // one decimal place
  newValues.gcActivity = Math.round(newValues.gcActivity);


  lastMetricValues = newValues;

  return METRICS_CONFIG.map(config => {
    const numericValue = newValues[config.id] !== undefined ? Number(newValues[config.id]) : 0;
    return {
      ...config,
      value: `${numericValue.toFixed(config.unit === '%' || config.id === 'heapUsage' ? 1 : 0)} ${config.unit}`,
      currentNumericValue: numericValue,
    };
  });
};


const generateHistoricalDataForMetric = (metricId: string, timeWindow: string, unit: string): HistoricalDataPoint[] => {
  const now = new Date();
  const data: HistoricalDataPoint[] = [];
  let points = 60; // Default for 1h or less
  let intervalMinutes = 1;

  if (timeWindow === '5m') { points = 30; intervalMinutes = 0.1666; } // ~10s interval for 5 mins
  else if (timeWindow === '15m') { points = 45; intervalMinutes = 0.3333; } // ~20s interval for 15 mins
  else if (timeWindow === '1h') { points = 60; intervalMinutes = 1; }
  else if (timeWindow === '6h') { points = 72; intervalMinutes = 5; } // 6 * 12 points
  
  let baseValue = 50;
  let fluctuation = 20;

  if (metricId === 'heapUsage') { baseValue = 200; fluctuation = 100; }
  else if (metricId === 'threadCount') { baseValue = 40; fluctuation = 15; }
  else if (metricId === 'cpuUtilization') { baseValue = 25; fluctuation = 20; }


  for (let i = 0; i < points; i++) {
    const timestamp = subMinutes(now, i * intervalMinutes);
    let value = baseValue + (Math.random() * fluctuation - fluctuation / 2) + Math.sin(i / (points/ (Math.random()*2+1) )) * fluctuation/2 ; // Add some sinusoidal pattern for realism
    value = Math.max(0, value);
    if (metricId === 'cpuUtilization') value = Math.min(100, value);
    if (metricId === 'threadCount') value = Math.round(value);
    else value = Math.round(value * 10) / 10;

    data.push({ timestamp: formatISO(timestamp), value });
  }
  return data.reverse(); // Ensure chronological order
};

export const generateMockMetricHistories = (timeWindow: string = DEFAULT_CHART_TIME_WINDOW): MetricHistory[] => {
  return METRICS_CONFIG
    .filter(config => config.historical)
    .map(config => ({
      metricId: config.id,
      data: generateHistoricalDataForMetric(config.id, timeWindow, config.unit),
    }));
};

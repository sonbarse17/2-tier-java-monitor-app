'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { JvmMetric, MetricHistory, TimeWindowOption, JvmMetricValue } from '@/types';
import { Header } from '@/components/layout/Header';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { MetricsTable } from '@/components/dashboard/MetricsTable';
import { HistoricalChartComponent } from '@/components/dashboard/HistoricalChartComponent';
import { AiInsightsCard } from '@/components/dashboard/AiInsightsCard';
import { generateMockJvmMetrics, generateMockMetricHistories } from '@/lib/mockData';
import {
  MONITORING_INTERVAL_MS,
  METRICS_CONFIG,
  CHART_TIME_WINDOWS,
  DEFAULT_CHART_TIME_WINDOW,
  getMetricConfig,
} from '@/config/monitoringConfig';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [jvmMetrics, setJvmMetrics] = useState<JvmMetric[]>([]);
  const [metricHistories, setMetricHistories] = useState<MetricHistory[]>([]);
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<string>(DEFAULT_CHART_TIME_WINDOW);
  const [isLoading, setIsLoading] = useState(true);

  const currentMetricValues: JvmMetricValue | null = useMemo(() => {
    if (jvmMetrics.length === 0) return null;
    const values: Partial<JvmMetricValue> = {};
    METRICS_CONFIG.forEach(config => {
      const metric = jvmMetrics.find(m => m.id === config.id);
      if (metric) {
        values[config.id] = metric.currentNumericValue;
      }
    });
    return values as JvmMetricValue;
  }, [jvmMetrics]);
  
  const fetchData = useCallback((timeWindow: string) => {
    const currentMetrics = generateMockJvmMetrics();
    const historicalData = generateMockMetricHistories(timeWindow);
    setJvmMetrics(currentMetrics);
    setMetricHistories(historicalData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData(selectedTimeWindow); // Initial fetch
    const intervalId = setInterval(() => fetchData(selectedTimeWindow), MONITORING_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [fetchData, selectedTimeWindow]);

  const handleTimeWindowChange = (value: string) => {
    setIsLoading(true);
    setSelectedTimeWindow(value);
    // Fetch new data for the selected time window (will be picked up by useEffect)
  };
  
  const keyMetrics = useMemo(() => {
    return jvmMetrics.filter(m => ['heapUsage', 'threadCount', 'cpuUtilization'].includes(m.id as string));
  }, [jvmMetrics]);

  if (isLoading && jvmMetrics.length === 0) { // Show full page skeleton only on initial hard load
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-lg shadow-lg" />)}
          </div>
          <Skeleton className="h-64 rounded-lg shadow-lg" />
          <Skeleton className="h-12 w-48 rounded-lg" />
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
             {[1,2,3].map(i => <Skeleton key={i} className="h-80 rounded-lg shadow-lg" />)}
          </div>
          <Skeleton className="h-72 rounded-lg shadow-lg" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8">
        {/* Key Metric Cards */}
        <section aria-labelledby="key-metrics-title">
          <h2 id="key-metrics-title" className="sr-only">Key Metrics</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {keyMetrics.map(metric => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </section>

        {/* Metrics Table and AI Insights */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MetricsTable metrics={jvmMetrics} />
          </div>
          <div>
            <AiInsightsCard currentMetrics={currentMetricValues} />
          </div>
        </div>
        
        {/* Historical Charts */}
        <section aria-labelledby="historical-charts-title">
           <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle id="historical-charts-title" className="font-headline text-xl text-primary">
                Historical Trends
              </CardTitle>
              <Select value={selectedTimeWindow} onValueChange={handleTimeWindowChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time window" />
                </SelectTrigger>
                <SelectContent>
                  {CHART_TIME_WINDOWS.map(window => (
                    <SelectItem key={window.value} value={window.value}>
                      {window.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {isLoading && metricHistories.length > 0 && ( // Show skeleton for chart area if loading new time window
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 pt-4">
                  {[1,2,3].map(i => <Skeleton key={i} className="h-80 rounded-lg" />)}
                </div>
              )}
              {!isLoading && (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 pt-4">
                {metricHistories.map((history, index) => {
                  const config = getMetricConfig(history.metricId);
                  if (!config) return null;
                  return (
                    <HistoricalChartComponent
                      key={history.metricId}
                      title={config.name}
                      data={history.data}
                      metricUnit={config.unit}
                      icon={config.icon}
                      colorVar={`var(--chart-${(index % 5) + 1})`} // Cycle through chart colors
                    />
                  );
                })}
              </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

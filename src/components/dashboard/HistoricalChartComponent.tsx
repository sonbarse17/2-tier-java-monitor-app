import type { HistoricalDataPoint } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, TooltipProps } from 'recharts';
import type { LucideIcon } from 'lucide-react';
import { format } from 'date-fns';

interface HistoricalChartComponentProps {
  title: string;
  data: HistoricalDataPoint[];
  metricUnit: string;
  icon: LucideIcon;
  colorVar: string; // e.g., "var(--chart-1)"
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Time
            </span>
            <span className="font-bold text-muted-foreground">
              {format(new Date(label), "HH:mm:ss")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Value
            </span>
            <span className="font-bold">
              {payload[0].value?.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};


export function HistoricalChartComponent({ title, data, metricUnit, icon: Icon, colorVar }: HistoricalChartComponentProps) {
  const chartConfig = {
    value: {
      label: title,
      color: colorVar,
      icon: Icon,
    },
  };

  return (
    <Card className="shadow-lg flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium font-headline text-primary">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                accessibilityLayer
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="timestamp"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => format(new Date(value), "HH:mm")}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}${metricUnit}`}
                  className="text-xs"
                  domain={['auto', 'auto']}
                />
                <ChartTooltip
                  cursor={true}
                  content={<CustomTooltip />}
                />
                <Line
                  dataKey="value"
                  type="monotone"
                  stroke={colorVar}
                  strokeWidth={2}
                  dot={false}
                  name={title}
                  aria-label={`${title} historical data`}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            No data available for this time window.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

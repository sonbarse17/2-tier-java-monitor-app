import type { JvmMetric } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  metric: JvmMetric;
  className?: string;
}

export function MetricCard({ metric, className }: MetricCardProps) {
  const IconComponent = metric.icon;
  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground font-headline">
          {metric.name}
        </CardTitle>
        <IconComponent className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">
          {metric.value.split(' ')[0]} 
          <span className="text-xl font-medium text-muted-foreground ml-1">{metric.unit}</span>
        </div>
        {/* Potential for a small trend indicator or previous value here */}
      </CardContent>
    </Card>
  );
}

import type { JvmMetric } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MetricsTableProps {
  metrics: JvmMetric[];
}

export function MetricsTable({ metrics }: MetricsTableProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary">Current JVM Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] md:h-auto"> {/* Adjust height as needed */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric) => {
                const IconComponent = metric.icon;
                return (
                  <TableRow key={metric.id}>
                    <TableCell>
                      <IconComponent className="h-5 w-5 text-primary" />
                    </TableCell>
                    <TableCell className="font-medium">{metric.name}</TableCell>
                    <TableCell className="text-right">{metric.value}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

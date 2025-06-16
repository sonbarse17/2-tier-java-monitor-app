'use client';

import React, { useState, useTransition } from 'react';
import type { JvmMetricValue } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateHealthInsights, HealthInsightsInput } from '@/ai/flows/generate-health-insights';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface AiInsightsCardProps {
  currentMetrics: JvmMetricValue | null;
}

export function AiInsightsCard({ currentMetrics }: AiInsightsCardProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerateInsights = async () => {
    if (!currentMetrics) {
      toast({
        title: "Error",
        description: "No current metrics available to analyze.",
        variant: "destructive",
      });
      return;
    }

    const input: HealthInsightsInput = {
      heapUsage: currentMetrics.heapUsage || 0,
      threadCount: currentMetrics.threadCount || 0,
      cpuUtilization: currentMetrics.cpuUtilization || 0,
    };
    
    startTransition(async () => {
      try {
        setInsights(null); // Clear previous insights
        const result = await generateHealthInsights(input);
        setInsights(result.insights);
      } catch (error) {
        console.error("Failed to generate health insights:", error);
        toast({
          title: "AI Insight Error",
          description: "Could not generate health insights. Please try again later.",
          variant: "destructive",
        });
        setInsights(null);
      }
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-xl text-primary">AI Health Check</CardTitle>
          <BrainCircuit className="h-6 w-6 text-accent" />
        </div>
        <CardDescription>
          Get AI-powered insights based on the current JVM metrics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="flex items-center justify-center p-6 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating insights...
          </div>
        )}
        {!isPending && insights && (
          <ScrollArea className="h-40 rounded-md border p-4 bg-secondary/30">
            <p className="text-sm whitespace-pre-wrap">{insights}</p>
          </ScrollArea>
        )}
        {!isPending && !insights && (
          <div className="text-center p-6 text-muted-foreground">
            Click the button below to generate health insights.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateInsights} disabled={isPending || !currentMetrics} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Generate Health Insights"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

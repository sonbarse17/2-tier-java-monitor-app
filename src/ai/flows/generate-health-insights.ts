'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating health insights based on JVM metrics.
 *
 * - generateHealthInsights - A function that triggers the health insights generation flow.
 * - HealthInsightsInput - The input type for the generateHealthInsights function.
 * - HealthInsightsOutput - The return type for the generateHealthInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthInsightsInputSchema = z.object({
  heapUsage: z.number().describe('The current heap usage of the JVM in MB.'),
  threadCount: z.number().describe('The current thread count of the JVM.'),
  cpuUtilization: z
    .number()
    .describe('The current CPU utilization of the JVM as a percentage (0-100).'),
});
export type HealthInsightsInput = z.infer<typeof HealthInsightsInputSchema>;

const HealthInsightsOutputSchema = z.object({
  insights: z.string().describe('Natural language insights on potential anomalies or areas of concern based on the provided JVM metrics.'),
});
export type HealthInsightsOutput = z.infer<typeof HealthInsightsOutputSchema>;

export async function generateHealthInsights(input: HealthInsightsInput): Promise<HealthInsightsOutput> {
  return generateHealthInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthInsightsPrompt',
  input: {schema: HealthInsightsInputSchema},
  output: {schema: HealthInsightsOutputSchema},
  prompt: `You are an AI expert in analyzing JVM metrics and identifying potential issues.

  Based on the following JVM metrics, provide natural language insights on potential anomalies or areas of concern. Be concise and specific in your observations.

  Heap Usage: {{heapUsage}} MB
  Thread Count: {{threadCount}}
  CPU Utilization: {{cpuUtilization}}%

  Consider these factors when generating insights:
  - High heap usage may indicate memory leaks or inefficient memory management.
  - A high thread count could lead to performance bottlenecks and increased CPU usage.
  - High CPU utilization might point to resource contention or inefficient code.
  - Provide actionable recommendations when you detect abnormalities
  `,
});

const generateHealthInsightsFlow = ai.defineFlow(
  {
    name: 'generateHealthInsightsFlow',
    inputSchema: HealthInsightsInputSchema,
    outputSchema: HealthInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

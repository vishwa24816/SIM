'use server';

/**
 * @fileOverview A flow that summarizes the latest cryptocurrency market news.
 *
 * - summarizeMarketNews - A function that summarizes the latest market news.
 * - SummarizeMarketNewsInput - The input type for the summarizeMarketNews function.
 * - SummarizeMarketNewsOutput - The return type for the summarizeMarketNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMarketNewsInputSchema = z.object({
  newsArticles: z.array(
    z.string().describe('A news article related to the cryptocurrency market.')
  ).describe('An array of news articles to summarize.'),
});

export type SummarizeMarketNewsInput = z.infer<typeof SummarizeMarketNewsInputSchema>;

const SummarizeMarketNewsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the latest cryptocurrency market news.'),
});

export type SummarizeMarketNewsOutput = z.infer<typeof SummarizeMarketNewsOutputSchema>;

export async function summarizeMarketNews(input: SummarizeMarketNewsInput): Promise<SummarizeMarketNewsOutput> {
  return summarizeMarketNewsFlow(input);
}

const summarizeMarketNewsPrompt = ai.definePrompt({
  name: 'summarizeMarketNewsPrompt',
  input: {schema: SummarizeMarketNewsInputSchema},
  output: {schema: SummarizeMarketNewsOutputSchema},
  prompt: `You are an AI assistant helping users to stay up to date on the cryptocurrency market.
  Summarize the following news articles, focusing on the most important trends and events:

  {{#each newsArticles}}
  Article {{@index}}: {{{this}}}
  {{/each}}
  `,
});

const summarizeMarketNewsFlow = ai.defineFlow(
  {
    name: 'summarizeMarketNewsFlow',
    inputSchema: SummarizeMarketNewsInputSchema,
    outputSchema: SummarizeMarketNewsOutputSchema,
  },
  async input => {
    const {output} = await summarizeMarketNewsPrompt(input);
    return output!;
  }
);

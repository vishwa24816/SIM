'use server';

/**
 * @fileOverview An AI flow for screening cryptocurrencies based on a user prompt.
 * 
 * - screenCryptos - A function that takes a prompt and a list of cryptos and returns a filtered list.
 * - CryptoScreenerInput - The input type for the screenCryptos function.
 * - CryptoScreenerOutput - The return type for the screenCryptos function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CryptoSchema = z.object({
  id: z.string().describe('The unique identifier for the cryptocurrency.'),
  name: z.string().describe('The name of the cryptocurrency.'),
  symbol: z.string().describe('The ticker symbol of the cryptocurrency.'),
  description: z.string().describe('A brief description of the cryptocurrency.'),
});

const CryptoScreenerInputSchema = z.object({
  prompt: z.string().describe('The user\'s request for filtering cryptocurrencies.'),
  cryptos: z.array(CryptoSchema).describe('The list of available cryptocurrencies to screen.'),
});

export type CryptoScreenerInput = z.infer<typeof CryptoScreenerInputSchema>;

const CryptoScreenerOutputSchema = z.object({
  cryptos: z.array(z.object({
    id: z.string().describe('The unique identifier for the cryptocurrency.')
  })).describe('An array of cryptocurrencies that match the user\'s prompt.'),
});

export type CryptoScreenerOutput = z.infer<typeof CryptoScreenerOutputSchema>;

export async function screenCryptos(input: CryptoScreenerInput): Promise<CryptoScreenerOutput> {
  return screenCryptosFlow(input);
}

const screenerPrompt = ai.definePrompt({
  name: 'cryptoScreenerPrompt',
  input: { schema: CryptoScreenerInputSchema },
  output: { schema: CryptoScreenerOutputSchema },
  prompt: `You are an expert crypto market analyst. Your task is to filter a list of cryptocurrencies based on a user's prompt.
Analyze the user's prompt and the provided list of cryptocurrencies.
Return ONLY the cryptocurrencies that strictly match the user's criteria.

User Prompt:
"{{{prompt}}}"

Available Cryptocurrencies:
{{#each cryptos}}
- ID: {{id}}, Name: {{name}} ({{symbol}})
{{/each}}

Based on the prompt, provide a JSON object containing the IDs of the matching cryptocurrencies.
If the prompt is vague or no cryptos match, return an empty array.
`,
});

const screenCryptosFlow = ai.defineFlow(
  {
    name: 'screenCryptosFlow',
    inputSchema: CryptoScreenerInputSchema,
    outputSchema: CryptoScreenerOutputSchema,
  },
  async (input) => {
    const { output } = await screenerPrompt(input);
    return output!;
  }
);

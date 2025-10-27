
'use server';
/**
 * @fileOverview An AI flow for backtesting a trading strategy.
 * 
 * - backtestStrategy - A function that takes a strategy and historical data and returns a list of trades.
 * - BacktestStrategyInput - The input type for the flow.
 * - BacktestStrategyOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { BacktestStrategyInput, BacktestStrategyInputSchema, BacktestStrategyOutput, BacktestStrategyOutputSchema } from '@/lib/types/backtest-strategy';
import { z } from 'zod';

export async function backtestStrategy(input: BacktestStrategyInput): Promise<BacktestStrategyOutput> {
  return backtestStrategyFlow(input);
}

const backtestPrompt = ai.definePrompt({
    name: 'backtestStrategyPrompt',
    input: { schema: BacktestStrategyInputSchema },
    output: { schema: BacktestStrategyOutputSchema },
    prompt: `
You are a trading simulation bot. Your task is to execute a given trading strategy against historical Bitcoin (BTC) price data.

**Strategy to execute:**
"{{{strategy}}}"

You MUST filter the historical data to match the timeframe specified in the strategy (e.g., "last 7 days", "last month"). The latest data point is the most recent.

**Execution Rules:**
1.  Iterate through the provided (and filtered) historical data, one day at a time. The asset is always BTC.
2.  If a BUY or SELL condition from the strategy is met, execute a trade.
3.  Assume all trades are executed at that day's closing price ('value').
4.  Record every trade (BUY or SELL) in the 'trades' array.
5.  **Your ONLY output should be a JSON object containing the 'trades' array.** Do not add any other fields or explanations. Do not perform any P&L calculations yourself. Just generate the trades.

**Full Historical Data (example):**
{{#each (slice history 0 5)}}
- {{time}}: {{value}}
{{/each}}
...
{{#each (slice history (subtract history.length 5) history.length)}}
- {{time}}: {{value}}
{{/each}}

Now, perform the simulation and return ONLY the 'trades' array in the specified JSON format.
`,
});


const backtestStrategyFlow = ai.defineFlow(
  {
    name: 'backtestStrategyFlow',
    inputSchema: BacktestStrategyInputSchema,
    outputSchema: BacktestStrategyOutputSchema,
  },
  async (input) => {
    // Helper for prompt to slice array
    ai.handlebars.registerHelper('slice', (arr, start, end) => arr.slice(start, end));
    ai.handlebars.registerHelper('subtract', (a, b) => a - b);
    
    try {
        const { output } = await backtestPrompt(input);
        return output || { trades: [] };
    } catch(e) {
        console.error("Error in backtestStrategyFlow:", e);
        return { trades: [] };
    }
  }
);

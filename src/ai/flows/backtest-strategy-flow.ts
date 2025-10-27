
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

export async function backtestStrategy(input: BacktestStrategyInput): Promise<BacktestStrategyOutput> {
  return backtestStrategyFlow(input);
}

const backtestPrompt = ai.definePrompt({
    name: 'backtestStrategyPrompt',
    input: { schema: BacktestStrategyInputSchema },
    output: { schema: BacktestStrategyOutputSchema },
    prompt: `
You are a sophisticated trading bot that simulates a given trading strategy against historical price data for BTC, assuming all prices are in INR (₹).

You will simulate the strategy day by day, starting with an initial capital of ₹10,000,000 INR and 0 BTC.

**Strategy to execute:**
"{{{strategy}}}"

If the user specifies a timeframe (e.g., "last 7 days", "last month"), you MUST filter the historical data to only use that period. The latest data point is the most recent.

**Execution Rules:**
1.  Iterate through the provided (and potentially filtered) historical data, one day at a time.
2.  At each day, evaluate the conditions described in the user's strategy.
3.  If a BUY or SELL condition is met, execute a trade.
4.  The asset for all trades is "BTC".
5.  Maintain a portfolio state: current INR balance and current BTC holdings.
6.  Record every trade (BUY or SELL) in the 'trades' array.
    - For a BUY trade, the P&L is 0.
    - For a SELL trade, calculate the realized P&L based on the difference between the sell price and the average buy price of the BTC being sold.
7.  You must strictly follow the quantities specified in the strategy. If the portfolio does not have enough BTC to sell or enough INR to buy, the trade cannot be executed.
8.  Assume all trades are executed at the day's closing price ('value').

**Full Historical Data (first 5 and last 5 points shown):**
{{#each (slice history 0 5)}}
- {{time}}: {{value}}
{{/each}}
...
{{#each (slice history (subtract history.length 5) history.length)}}
- {{time}}: {{value}}
{{/each}}

Your only task is to generate the list of trades based on the strategy. Do not calculate summary statistics.
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
    
    const { output } = await backtestPrompt(input);
    return output!;
  }
);

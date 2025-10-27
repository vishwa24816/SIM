'use server';
/**
 * @fileOverview An AI flow for backtesting a trading strategy.
 * 
 * - backtestStrategyFlow - A function that takes a strategy and historical data and returns backtest results.
 * - BacktestStrategyInput - The input type for the flow.
 * - BacktestStrategyOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PricePointSchema = z.object({
  time: z.string().describe('The timestamp for the price point.'),
  value: z.number().describe('The price at that time.'),
});

export const BacktestStrategyInputSchema = z.object({
  strategy: z.string().describe('The trading strategy in natural language.'),
  history: z.array(PricePointSchema).describe('The historical price data for the asset (BTC).'),
});
export type BacktestStrategyInput = z.infer<typeof BacktestStrategyInputSchema>;

const TradeSchema = z.object({
    date: z.string().describe('The date of the trade.'),
    type: z.enum(['BUY', 'SELL']).describe('The type of trade.'),
    asset: z.string().describe('The asset being traded (e.g., BTC).'),
    price: z.number().describe('The price at which the trade was executed.'),
    quantity: z.number().describe('The quantity of the asset traded.'),
    pnl: z.number().describe('The profit or loss from this trade. For BUY trades, P&L is 0. For SELL trades, it is the realized gain or loss.'),
});

const PortfolioPointSchema = z.object({
    time: z.string().describe('The timestamp for the portfolio value point.'),
    value: z.number().describe('The total value of the portfolio at that time.'),
});

export const BacktestStrategyOutputSchema = z.object({
  netPnl: z.number().describe('The net profit or loss over the entire backtest period.'),
  netPnlPercentage: z.number().describe('The net P&L as a percentage of the initial investment.'),
  totalTrades: z.number().describe('The total number of trades executed.'),
  winRate: z.number().describe('The percentage of profitable trades out of all closing trades.'),
  portfolioHistory: z.array(PortfolioPointSchema).describe('The history of the portfolio\'s total value over time.'),
  trades: z.array(TradeSchema).describe('A list of all trades executed during the backtest.'),
});
export type BacktestStrategyOutput = z.infer<typeof BacktestStrategyOutputSchema>;

export async function backtestStrategy(input: BacktestStrategyInput): Promise<BacktestStrategyOutput> {
  return backtestStrategyFlow(input);
}

const backtestPrompt = ai.definePrompt({
    name: 'backtestStrategyPrompt',
    input: { schema: BacktestStrategyInputSchema },
    output: { schema: BacktestStrategyOutputSchema },
    prompt: `
You are a sophisticated trading bot that backtests a given trading strategy against historical price data for BTC.

You will simulate the strategy day by day, starting with an initial capital of $100,000 USD and 0 BTC.

**Strategy to execute:**
"{{{strategy}}}"

**Execution Rules:**
1.  Iterate through the provided historical data, one day at a time.
2.  At each day, evaluate the conditions described in the user's strategy.
3.  If a BUY or SELL condition is met, execute a trade.
4.  The asset for all trades is "BTC".
5.  Maintain a portfolio state: current USD balance and current BTC holdings.
6.  For each day, calculate the total portfolio value (USD balance + (BTC holdings * current price)).
7.  Record every trade (BUY or SELL) in the 'trades' array.
    - For a BUY trade, the P&L is 0.
    - For a SELL trade, calculate the realized P&L based on the difference between the sell price and the average buy price of the BTC being sold.
8.  After iterating through all data, calculate the summary statistics:
    - **netPnl**: Final Portfolio Value - Initial Capital ($100,000).
    - **netPnlPercentage**: (netPnl / Initial Capital) * 100.
    - **totalTrades**: Total number of BUY and SELL orders.
    - **winRate**: (Number of profitable SELL trades / Total number of SELL trades) * 100. If no sell trades, win rate is 0.
9.  You must strictly follow the quantities specified in the strategy. If the portfolio does not have enough BTC to sell or enough USD to buy, the trade cannot be executed.
10. Assume all trades are executed at the day's closing price ('value').

**Historical Data (first 5 and last 5 points shown):**
{{#each (slice history 0 5)}}
- {{time}}: {{value}}
{{/each}}
...
{{#each (slice history (subtract history.length 5) history.length)}}
- {{time}}: {{value}}
{{/each}}


Now, perform the backtest and return the results in the specified JSON format.
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

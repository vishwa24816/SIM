'use server';
/**
 * @fileOverview An AI flow for backtesting a trading strategy.
 * 
 * - backtestStrategyFlow - A function that takes a strategy and historical data and returns backtest results.
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
You are a sophisticated trading bot that backtests a given trading strategy against historical price data for BTC, assuming all prices are in INR (₹).

You will simulate the strategy day by day, starting with an initial capital of ₹10,000,000 INR and 0 BTC.

**Strategy to execute:**
"{{{strategy}}}"

**Execution Rules:**
1.  Iterate through the provided historical data, one day at a time.
2.  At each day, evaluate the conditions described in the user's strategy.
3.  If a BUY or SELL condition is met, execute a trade.
4.  The asset for all trades is "BTC".
5.  Maintain a portfolio state: current INR balance and current BTC holdings.
6.  For each day, calculate the total portfolio value (INR balance + (BTC holdings * current price)). Record this value.
7.  Record every trade (BUY or SELL) in the 'trades' array.
    - For a BUY trade, the P&L is 0.
    - For a SELL trade, calculate the realized P&L based on the difference between the sell price and the average buy price of the BTC being sold.
8.  After iterating through all data, calculate the summary statistics:
    - **netPnl**: Final Portfolio Value - Initial Capital (₹10,000,000).
    - **netPnlPercentage**: (netPnl / Initial Capital) * 100.
    - **totalTrades**: Total number of BUY and SELL orders.
    - **winRate**: (Number of profitable SELL trades / Total number of SELL trades) * 100. If no sell trades, win rate is 0.
    - **maxDrawdown**: The largest percentage drop from a portfolio's peak value to its subsequent trough. Calculate it as ((Peak Value - Trough Value) / Peak Value) * 100.
    - **sharpeRatio**: Calculate the Sharpe Ratio. First, calculate the daily portfolio returns. Then, compute the average daily return and the standard deviation of daily returns. Annualize these values (average daily return * 365, standard deviation * sqrt(365)). The Sharpe Ratio is the Annualized Average Return / Annualized Standard Deviation. Assume a risk-free rate of 0.
9.  You must strictly follow the quantities specified in the strategy. If the portfolio does not have enough BTC to sell or enough INR to buy, the trade cannot be executed.
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

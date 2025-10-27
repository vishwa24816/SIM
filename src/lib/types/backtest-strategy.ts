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
  netPnl: z.number().describe('The net profit or loss over the entire backtest period in INR.'),
  netPnlPercentage: z.number().describe('The net P&L as a percentage of the initial investment.'),
  totalTrades: z.number().describe('The total number of trades executed.'),
  winRate: z.number().describe('The percentage of profitable trades out of all closing trades.'),
  maxDrawdown: z.number().describe('The maximum drawdown percentage from a peak to a trough of the portfolio.'),
  sharpeRatio: z.number().describe('The Sharpe ratio of the strategy, assuming a risk-free rate of 0.'),
  trades: z.array(TradeSchema).describe('A list of all trades executed during the backtest.'),
});
export type BacktestStrategyOutput = z.infer<typeof BacktestStrategyOutputSchema>;

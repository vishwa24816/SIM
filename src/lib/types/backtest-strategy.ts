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
    date: z.string().describe('The date of the trade in YYYY-MM-DD format.'),
    type: z.enum(['BUY', 'SELL']).describe('The type of trade.'),
    asset: z.literal('BTC').describe('The asset being traded, which is always BTC.'),
    price: z.number().describe('The price at which the trade was executed.'),
    quantity: z.number().describe('The quantity of the asset traded.'),
    pnl: z.number().optional().describe('The profit or loss from this trade. For BUY trades, this should be 0. For SELL trades, it is the realized gain or loss. This is an optional field.'),
});
export type BacktestTrade = z.infer<typeof TradeSchema>;

export const BacktestStrategyOutputSchema = z.object({
  trades: z.array(TradeSchema).describe('A list of all trades executed during the backtest.'),
});
export type BacktestStrategyOutput = z.infer<typeof BacktestStrategyOutputSchema>;

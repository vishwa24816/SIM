import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-market-news.ts';
import '@/ai/flows/crypto-screener-flow.ts';
import '@/ai/flows/backtest-strategy-flow.ts';

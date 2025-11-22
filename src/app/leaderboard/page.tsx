'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, Flame, Search, Users, Copy, Bitcoin, Codepen } from 'lucide-react';
import { Area, AreaChart } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { Header } from '@/components/dashboard/header';
import { BottomNav } from '@/components/dashboard/bottom-nav';

interface Trader {
  name: string;
  handle: string;
  avatar: string;
  followers: number;
  capacity: number;
  roi: number;
  totalPnl: number;
  aum: number;
  followersPnl: number;
  maxDrawdown: number;
  tags: string[];
  chartData: { value: number }[];
  isTop: boolean;
  topBadge?: string;
  mainCoin: 'btc' | 'eth';
}

const traders: Trader[] = [
  {
    name: 'BGUSER-BFH2MC...',
    handle: '@BGUSER-BFH2MCBL',
    avatar: '',
    followers: 967,
    capacity: 1000,
    roi: 8947.74,
    totalPnl: 18038.63,
    aum: 831879.06,
    followersPnl: 3588.28,
    maxDrawdown: 1.00,
    tags: ['Stable', 'High profit'],
    chartData: [{ value: 10 }, { value: 20 }, { value: 50 }, { value: 80 }, { value: 95 }, { value: 98 }, { value: 100 }],
    isTop: true,
    topBadge: '🏆',
    mainCoin: 'btc'
  },
  {
    name: 'BGUSER-VARG3320',
    handle: '@BGUSER-VARG3320',
    avatar: '',
    followers: 655,
    capacity: 750,
    roi: 8922.00,
    totalPnl: 19073.39,
    aum: 541534.88,
    followersPnl: -155639.01,
    maxDrawdown: 8.59,
    tags: ['Top performer', 'Stable'],
    chartData: [{ value: 100 }, { value: 90 }, { value: 85 }, { value: 70 }, { value: 60 }, { value: 55 }, { value: 50 }],
    isTop: true,
    topBadge: '🥇',
    mainCoin: 'btc'
  },
  {
    name: 'AmbitionLruri',
    handle: '@BGUSER-EYPFNB2R',
    avatar: '',
    followers: 524,
    capacity: 550,
    roi: 8458.51,
    totalPnl: 18118.38,
    aum: 353849.37,
    followersPnl: -136315.33,
    maxDrawdown: 12.21,
    tags: ['Long-term', 'Stable'],
    chartData: [{ value: 100 }, { value: 80 }, { value: 85 }, { value: 75 }, { value: 65 }, { value: 70 }, { value: 60 }],
    isTop: true,
    topBadge: '🥈',
    mainCoin: 'btc'
  },
  {
    name: 'Brightmoon',
    handle: '@Brightmoon',
    avatar: '/brightmoon-avatar.png',
    followers: 659,
    capacity: 750,
    roi: 8439.33,
    totalPnl: 16683.38,
    aum: 283009.57,
    followersPnl: -329603.50,
    maxDrawdown: 3.03,
    tags: ['Most popular', 'Stable'],
    chartData: [{ value: 100 }, { value: 95 }, { value: 80 }, { value: 70 }, { value: 65 }, { value: 50 }, { value: 45 }],
    isTop: false,
    mainCoin: 'btc'
  },
];

const TraderCard: React.FC<{ trader: Trader }> = ({ trader }) => {
  const isPnlNegative = trader.followersPnl < 0;
  const isRoiPositive = trader.roi >= 0;

  return (
    <Card className={cn("bg-card/80 backdrop-blur-sm", trader.isTop ? 'border-yellow-400/50' : '')}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={trader.avatar} />
              <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold truncate max-w-[120px]">{trader.name}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[120px]">{trader.handle}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Users className="h-3 w-3" />
                <span>{trader.followers}/{trader.capacity}</span>
              </div>
            </div>
          </div>
          {trader.topBadge && <span className="text-2xl">{trader.topBadge}</span>}
        </div>

        <div>
          <p className={cn("text-3xl font-bold", isRoiPositive ? 'text-green-500' : 'text-red-500')}>
            +{trader.roi.toFixed(2)}%
          </p>
          <p className="text-sm text-muted-foreground">ROI</p>
          <div className="h-16 -mx-4 -mb-2">
            <ChartContainer config={{}} className="h-full w-full">
              <AreaChart data={trader.chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`gradient-${trader.handle}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isRoiPositive ? 'var(--color-green-500)' : 'var(--color-red-500)'} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={isRoiPositive ? 'var(--color-green-500)' : 'var(--color-red-500)'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke={isRoiPositive ? '#22c55e' : '#ef4444'} fill={`url(#gradient-${trader.handle})`} strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        <div className="text-xs space-y-3">
          <div className="flex justify-between">
            <div>
              <p className="text-muted-foreground">Total PnL</p>
              <p className="font-semibold text-lg">${trader.totalPnl.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">AUM</p>
              <p className="font-semibold text-lg">${trader.aum.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-muted-foreground">Total followers PnL</p>
              <p className={cn("font-semibold text-base", isPnlNegative ? "text-red-500" : "text-green-500")}>
                {isPnlNegative ? '-' : '+'}${Math.abs(trader.followersPnl).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Max drawdown</p>
              <p className="font-semibold text-base">{trader.maxDrawdown.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
             <Bitcoin className="w-4 h-4 text-orange-400" />
             <Codepen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex flex-wrap gap-1">
            {trader.tags.map(tag => (
              <span key={tag} className="bg-muted px-1.5 py-0.5 rounded">{tag}</span>
            ))}
          </div>
        </div>
        
        <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold">
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
      </CardContent>
    </Card>
  );
};

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = React.useState('Top traders');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 border-b">
            <Button
              variant="ghost"
              onClick={() => setActiveTab('Top traders')}
              className={cn(
                "rounded-none border-b-2 border-transparent",
                activeTab === 'Top traders' && 'border-primary text-primary'
              )}
            >
              <Flame className="w-4 h-4 mr-2" /> Top traders
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('All traders')}
              className={cn(
                "rounded-none border-b-2 border-transparent text-muted-foreground",
                activeTab === 'All traders' && 'border-primary text-primary'
              )}
            >
              All traders
            </Button>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search traders"
              className="bg-muted pl-10 pr-4 py-2 rounded-lg w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Highest ROI</h2>
          <Button variant="link" className="text-primary">
            More <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {traders.map((trader) => (
            <TraderCard key={trader.handle} trader={trader} />
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

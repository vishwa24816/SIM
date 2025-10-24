
"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CryptoCurrency } from "@/lib/types"
import { TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface PriceChartProps {
  crypto: CryptoCurrency;
  loading: boolean;
}

export function PriceChart({ crypto, loading }: PriceChartProps) {
  const isPositiveChange = crypto.change24h >= 0;

  const chartConfig = {
    price: {
      label: crypto.symbol,
      color: isPositiveChange ? "hsl(142.1 76.2% 41.2%)" : "hsl(0 84.2% 60.2%)",
    },
  }

  const lastPrice = crypto.priceHistory[crypto.priceHistory.length - 2]?.value ?? crypto.price;
  const isUp = crypto.price >= lastPrice;

  return (
    <div>
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-2xl font-semibold leading-none tracking-tight">{crypto.name} Price</h3>
                <p className="text-sm text-muted-foreground">Live data from CoinGecko.</p>
            </div>
            <div className="text-right">
              {loading ? (
                <>
                  <Skeleton className="h-8 w-32 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-end gap-1">
                      <div className={cn("text-2xl font-bold", isUp ? "text-green-500" : "text-red-500")}>
                          ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: crypto.price < 1 ? 6 : 2 })}
                      </div>
                      {isUp ? <TrendingUp className="h-6 w-6 text-green-500" /> : <TrendingDown className="h-6 w-6 text-red-500" />}
                  </div>
                  <div className={cn("text-sm font-medium", crypto.change24h >= 0 ? "text-green-500" : "text-red-500")}>
                      {crypto.change24h.toFixed(2)}% (24h)
                  </div>
                </>
              )}
            </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        {loading ? (
            <div className="h-[250px] w-full">
              <Skeleton className="h-full w-full" />
            </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <AreaChart
              accessibilityLayer
              data={crypto.priceHistory}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis
                  domain={['dataMin - (dataMin * 0.1)', 'dataMax + (dataMax * 0.1)']}
                  hide
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <defs>
                  <linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142.1 76.2% 41.2%)" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="hsl(142.1 76.2% 41.2%)" stopOpacity={0.7}/>
                  </linearGradient>
                  <linearGradient id="fillRed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0 84.2% 60.2%)" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="hsl(0 84.2% 60.2%)" stopOpacity={0.7}/>
                  </linearGradient>
              </defs>
              <Area
                dataKey="value"
                type="natural"
                fill={isPositiveChange ? "url(#fillGreen)" : "url(#fillRed)"}
                stroke={isPositiveChange ? "hsl(142.1 76.2% 41.2%)" : "hsl(0 84.2% 60.2%)"}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </div>
    </div>
  )
}


"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  
  const domain = React.useMemo(() => {
    const values = crypto.priceHistory.map(p => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  }, [crypto.priceHistory]);


  return (
    <div>
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-2xl font-semibold leading-none tracking-tight">{crypto.name} Price</h3>
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
            <LineChart
              accessibilityLayer
              data={crypto.priceHistory}
              margin={{
                left: 12,
                right: 12,
                top: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              />
              <YAxis
                  domain={domain}
                  hide
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor={isPositiveChange ? "hsl(142.1 76.2% 41.2%)" : "hsl(0 84.2% 60.2%)"} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={isPositiveChange ? "hsl(217 91% 60%)" : "hsl(25 95% 53%)"} stopOpacity={0.8}/>
                  </linearGradient>
              </defs>
              <Line
                dataKey="value"
                type="monotone"
                stroke="url(#lineGradient)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </div>
    </div>
  )
}

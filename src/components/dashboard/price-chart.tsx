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

interface PriceChartProps {
  crypto: CryptoCurrency;
}

export function PriceChart({ crypto }: PriceChartProps) {
  const chartConfig = {
    price: {
      label: crypto.symbol,
      color: "hsl(var(--accent))",
    },
  }

  const lastPrice = crypto.priceHistory[crypto.priceHistory.length - 1]?.value ?? 0;
  const isUp = crypto.price >= lastPrice;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{crypto.name} Price</CardTitle>
                <CardDescription>Simulated data, not from a live feed.</CardDescription>
            </div>
            <div className="text-right">
                <div className="flex items-center justify-end gap-1">
                    <div className={cn("text-2xl font-bold", isUp ? "text-green-500" : "text-red-500")}>
                        ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    {isUp ? <TrendingUp className="h-6 w-6 text-green-500" /> : <TrendingDown className="h-6 w-6 text-red-500" />}
                </div>
                 <div className={cn("text-sm font-medium", crypto.change24h >= 0 ? "text-green-500" : "text-red-500")}>
                    {crypto.change24h.toFixed(2)}% (24h)
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent>
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
                <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                </linearGradient>
            </defs>
            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillPrice)"
              stroke="hsl(var(--accent))"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

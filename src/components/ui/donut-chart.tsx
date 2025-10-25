
"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface DonutChartProps {
    data: { name: string; value: number, fill: string }[];
}

export function DonutChart({ data }: DonutChartProps) {

  const chartConfig = data.reduce((acc, item) => {
    acc[item.name] = { label: item.name, color: item.fill };
    return acc;
  }, {} as any);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-full"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="60%"
          strokeWidth={5}
        >
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

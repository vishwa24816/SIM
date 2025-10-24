"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Newspaper, Lightbulb } from "lucide-react";

export function NewsFeed() {
  
  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Newspaper className="w-6 h-6 text-primary" />
          <div>
            <CardTitle>Top Market News</CardTitle>
            <CardDescription>Latest headlines relevant to your view and AI-powered summaries.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold mb-4">Recent Headlines</h3>
            <div className="flex items-center justify-center h-24 rounded-lg bg-secondary/50">
                <p className="text-muted-foreground">No news relevant to this stock found.</p>
            </div>
        </div>
        <Separator />
        <div>
            <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold">AI News Summary</h3>
            </div>
            <Textarea 
                placeholder="Enter news headlines here, one per line..."
                className="bg-secondary/50 min-h-[100px]"
            />
        </div>
      </CardContent>
    </Card>
  );
}

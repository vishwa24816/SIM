"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NEWS_ARTICLES } from "@/lib/data";
import { getNewsSummary } from "@/app/actions";
import { Newspaper, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsFeed() {
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary(null);
    const articlesContent = NEWS_ARTICLES.map(a => a.content);
    const result = await getNewsSummary(articlesContent);
    setSummary(result);
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Newspaper className="w-6 h-6 text-accent" />
          <div>
            <CardTitle>Market News</CardTitle>
            <CardDescription>Latest updates from the crypto world</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSummarize} disabled={isLoading} className="w-full mb-4">
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? "Generating Summary..." : "Summarize with AI"}
        </Button>
        {(isLoading || summary) && (
            <div className="mb-4 p-4 border rounded-lg bg-secondary/50">
                <h4 className="font-semibold mb-2 text-accent">AI Summary</h4>
                {isLoading && (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                )}
                {summary && <p className="text-sm">{summary}</p>}
            </div>
        )}
        <ScrollArea className="h-[200px] w-full">
          <div className="space-y-4">
            {NEWS_ARTICLES.map((article, index) => (
              <React.Fragment key={article.id}>
                <div>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
                    {article.title}
                  </a>
                  <p className="text-xs text-muted-foreground">
                    {article.source} - {article.published}
                  </p>
                </div>
                {index < NEWS_ARTICLES.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

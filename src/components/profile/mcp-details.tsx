
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Code, Terminal, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <pre className="p-3 rounded-md bg-muted text-muted-foreground text-xs overflow-x-auto">
        <code>
            {children}
        </code>
    </pre>
)

export function McpDetails() {
    return (
        <div className="space-y-6 pl-10 text-sm">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Code className="w-5 h-5"/>
                        <CardTitle className="text-base">Step 1: Configuration</CardTitle>
                    </div>
                     <CardDescription>
                        Create a `.sim/mcp.json` file in your project directory with the following content.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CodeBlock>
{`{
  "mcpServers": {
    "sim-exchange": {
      "command": "npm",
      "args": [
        "run",
        "dev"
      ]
    }
  }
}`}
                    </CodeBlock>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5"/>
                        <CardTitle className="text-base">Step 2: Restart & Verify</CardTitle>
                    </div>
                     <CardDescription>
                       Save changes and restart your client to apply settings, then verify the connection.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 text-green-600 border border-green-500/20">
                        <CheckCircle className="w-5 h-5"/>
                        <div>
                            <p className="font-semibold">Connection Successful</p>
                            <p className="text-xs">MCP Server 'sim-exchange' is active.</p>
                        </div>
                    </div>
                     <div>
                        <p className="font-semibold mb-2">Test Connection</p>
                        <p className="text-muted-foreground mb-2">Ask a simple question to test the connection. For example:</p>
                        <div className="p-3 rounded-md bg-muted italic">"What are the top 3 trending crypto assets?"</div>
                     </div>
                </CardContent>
            </Card>
        </div>
    )
}

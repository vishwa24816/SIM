'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';

const InfoRow = ({ label, value, onCopy }: { label: string; value: string; onCopy?: () => void }) => (
    <div className="py-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex justify-between items-center">
            <p className="font-semibold">{value}</p>
            {onCopy && (
                 <Button variant="ghost" size="icon" onClick={onCopy} className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                </Button>
            )}
        </div>
    </div>
);


export default function MyAccountPage() {
  const router = useRouter();
  const { copy } = useCopyToClipboard();
  const { toast } = useToast();

  const uid = 'VI58908975';

  const handleCopyUid = () => {
    copy(uid);
    toast({ title: 'UID Copied!' });
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">My Account</h1>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <div>
            <h2 className="text-lg font-semibold px-2 mb-2">Basic Information</h2>
            <Card>
                <CardContent className="p-4 divide-y">
                    <InfoRow label="User Name" value="Demo User" />
                    <InfoRow label="Email" value="demo123@simulation.app" />
                    <InfoRow label="Phone Number" value="9739911799" />
                    <InfoRow label="UID Number" value={uid} onCopy={handleCopyUid} />
                </CardContent>
            </Card>
        </div>

        <div>
            <div className="flex justify-between items-center px-2 mb-2">
                 <h2 className="text-lg font-semibold">Additional Information</h2>
                 <Button variant="link" className="text-primary">Edit</Button>
            </div>
            <Card>
                <CardContent className="p-4 divide-y">
                    <InfoRow label="Occupation" value="Professional" />
                    <InfoRow label="Annual Income" value="Upto 10 Lakhs" />
                    <InfoRow label="Nature of business" value="Broking Services / Financial Services" />
                    <InfoRow label="SEBI Research Analyst Tag" value="Not Provided" />
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

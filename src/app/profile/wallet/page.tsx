
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet as WalletIcon, Trash2, Eye, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWallets } from '@/hooks/use-wallets';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export default function WalletPage() {
  const router = useRouter();
  const { wallets, removeWallet, setPrimaryWallet } = useWallets();
  const { toast } = useToast();
  const [walletToRemove, setWalletToRemove] = React.useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = React.useState<string | undefined>(undefined);

  const handleGetPrivateKey = () => {
    toast({
      title: 'Request Received',
      description: 'You will get your private key in mail by 1 hour.',
    });
  };

  const handleDeleteConfirm = () => {
    if (walletToRemove) {
      removeWallet(walletToRemove);
      setWalletToRemove(null);
    }
  };

  const toggleAccordion = (walletId: string) => {
    setOpenAccordion(prev => prev === walletId ? undefined : walletId);
  }

  const dummyPhrase = "apple banana cherry date elderberry fig grape honey ice kiwi lemon mango";
  const dummyPublicKey = "0x1234567890ABCDEF1234567890ABCDEF12345678";


  return (
    <>
      <div className="bg-background min-h-screen">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-lg font-semibold">Wallet Management</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">Create Crypto Wallet</Button>
              <Button>Import Existing Wallet</Button>
          </div>
          {wallets.length === 0 ? (
            <div className="text-center py-20">
              <WalletIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Wallets Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Create or import a wallet to get started.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4" value={openAccordion} onValueChange={setOpenAccordion}>
              {wallets.map((wallet) => (
                <Card key={wallet.id}>
                  <AccordionItem value={wallet.id} className="border-b-0">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <AccordionTrigger className="p-0 hover:no-underline">
                                <div className="font-bold flex items-center gap-2">
                                    {wallet.name}
                                    {wallet.isPrimary && <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Primary</Badge>}
                                </div>
                            </AccordionTrigger>
                           <div className="flex items-center gap-1 pl-4">
                               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleAccordion(wallet.id)}>
                                 <Eye className="h-4 w-4" />
                               </Button>
                               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWalletToRemove(wallet.id)}>
                                   <Trash2 className="h-4 w-4 text-destructive" />
                               </Button>
                           </div>
                        </div>
                         <AccordionContent className="pt-4 px-0 pb-0">
                           <div className="space-y-4">
                                <div>
                                    <Label className="text-xs font-semibold">Recovery Phrase</Label>
                                    <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground grid grid-cols-3 gap-x-4 gap-y-2">
                                        {dummyPhrase.split(' ').map((word, index) => (
                                            <div key={index} className="flex items-baseline">
                                                <span className="text-xs mr-1.5">{index + 1}.</span>
                                                <span className="font-medium text-foreground">{word}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold">Public Key</Label>
                                    <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground mb-2">
                                        <span className="font-mono text-xs break-all text-foreground">{dummyPublicKey}</span>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full" onClick={handleGetPrivateKey}>Get private key</Button>
                                </div>
                           </div>
                        </AccordionContent>
                        
                        {!wallet.isPrimary && (
                            <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setPrimaryWallet(wallet.id)}>
                                <CheckCircle2 className="mr-2 h-4 w-4"/> Make Primary
                            </Button>
                        )}
                    </CardContent>
                  </AccordionItem>
                </Card>
              ))}
            </Accordion>
          )}
        </main>
      </div>

      <AlertDialog open={!!walletToRemove} onOpenChange={() => setWalletToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently remove this wallet. You cannot undo this action. Make sure you have saved your recovery phrase.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setWalletToRemove(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

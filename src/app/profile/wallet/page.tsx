
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Wallet as WalletIcon, Trash2, CheckCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallets } from '@/hooks/use-wallets';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const generatePublicKey = () => `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

export default function WalletManagementPage() {
  const router = useRouter();
  const { wallets, removeWallet, setPrimaryWallet } = useWallets();
  const [walletToDelete, setWalletToDelete] = React.useState<string | null>(null);

  const handleDelete = () => {
    if (walletToDelete) {
        removeWallet(walletToDelete);
        setWalletToDelete(null);
    }
  }

  return (
    <>
      <div className="bg-background min-h-screen">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-lg font-semibold">Wallet Management</h1>
            </div>
          </div>
        </header>

        <main className="p-4 space-y-6">
            <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" /> Create Crypto Wallet
                </Button>
                 <Button className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" /> Import Existing Wallet
                </Button>
            </div>
            
            <Accordion type="single" collapsible className="w-full space-y-4">
                {wallets.map(wallet => (
                    <AccordionItem value={wallet.id} key={wallet.id} className="border bg-card rounded-lg">
                        <AccordionTrigger className="p-4 hover:no-underline">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-3">
                                    <WalletIcon className="h-6 w-6 text-primary" />
                                    <div className="text-left">
                                        <h3 className="font-bold text-lg">{wallet.name}</h3>
                                        {wallet.isPrimary && (
                                            <Badge>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Primary
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">View</span>
                                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="p-4 pt-0 space-y-4">
                             <div>
                                <p className="text-sm font-semibold mb-2">Recovery Phrase</p>
                                <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground grid grid-cols-3 gap-x-4 gap-y-2">
                                  {wallet.recoveryPhrase.split(' ').map((word, i) => (
                                    <span key={i} className="font-mono text-foreground">
                                      <span className="text-muted-foreground">{i+1}.</span> {word}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-semibold mb-2">Public Key</p>
                                <p className="p-3 bg-muted rounded-md text-sm text-muted-foreground break-all">{generatePublicKey()}</p>
                              </div>
                               <div className="flex gap-2 mt-4">
                                {!wallet.isPrimary && (
                                    <Button variant="outline" className="w-full" onClick={() => setPrimaryWallet(wallet.id)}>
                                        Make Primary
                                    </Button>
                                )}
                                 <Button variant="destructive" size="sm" className="w-full" onClick={() => setWalletToDelete(wallet.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                               </div>
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </main>
      </div>
      <AlertDialog open={!!walletToDelete} onOpenChange={() => setWalletToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This will permanently delete this wallet. This action cannot be undone.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

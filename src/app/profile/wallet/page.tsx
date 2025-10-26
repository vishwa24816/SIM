
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Wallet as WalletIcon, Trash2, Eye, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWallets } from '@/hooks/use-wallets';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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

export default function WalletManagementPage() {
  const router = useRouter();
  const { wallets, removeWallet, setPrimaryWallet } = useWallets();
  const [walletToDelete, setWalletToDelete] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleShowPhrase = (phrase: string) => {
    toast({
        title: 'Recovery Phrase',
        description: phrase,
    });
  }

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
            
            <div className="space-y-4">
                {wallets.map(wallet => (
                    <Card key={wallet.id}>
                        <CardContent className="p-4">
                             <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <WalletIcon className="h-6 w-6 text-primary" />
                                    <h3 className="font-bold text-lg">{wallet.name}</h3>
                                </div>
                                {wallet.isPrimary ? (
                                    <Badge>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Primary
                                    </Badge>
                                ) : (
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setWalletToDelete(wallet.id)}>
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Recovery Phrase</span>
                                    <Button variant="ghost" size="icon" onClick={() => handleShowPhrase(wallet.recoveryPhrase)}>
                                        <Eye className="h-5 w-5 text-muted-foreground" />
                                    </Button>
                                </div>
                                <p><span className="text-muted-foreground">Account:</span> {wallet.accountId}</p>
                                <p><span className="text-muted-foreground">Type:</span> {wallet.type}</p>
                            </div>
                            
                            {!wallet.isPrimary && (
                                <Button variant="outline" className="w-full mt-4" onClick={() => setPrimaryWallet(wallet.id)}>
                                    Make Primary
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
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

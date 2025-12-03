
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet as WalletIcon, Trash2, CheckCircle2, ChevronDown, Eye, ShieldCheck, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallets, Wallet } from '@/hooks/use-wallets';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

const CreateWalletDialog = ({ open, onOpenChange, onConfirm }: { open: boolean; onOpenChange: (open: boolean) => void; onConfirm: (name: string, pin: string) => void }) => {
    const [name, setName] = React.useState('');
    const [pin, setPin] = React.useState('');
    const { toast } = useToast();

    const handleConfirm = () => {
        if (!name.trim() || !pin.trim()) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'Please provide a name and PIN.' });
            return;
        }
        if (pin.length !== 4 || !/^\d+$/.test(pin)) {
            toast({ variant: 'destructive', title: 'Invalid PIN', description: 'PIN must be 4 digits.' });
            return;
        }
        onConfirm(name, pin);
        setName('');
        setPin('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Wallet</DialogTitle>
                    <DialogDescription>Enter a name and a 4-digit PIN for your new wallet.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="wallet-name">Wallet Name</Label>
                        <Input id="wallet-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., My Savings" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="wallet-pin">4-Digit PIN</Label>
                        <Input id="wallet-pin" type="password" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={4} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleConfirm}>Create Wallet</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ImportWalletDialog = ({ open, onOpenChange, onConfirm }: { open: boolean; onOpenChange: (open: boolean) => void; onConfirm: (name: string, phrase: string, publicKey: string, privateKey: string) => void }) => {
    const [name, setName] = React.useState('');
    const [phrase, setPhrase] = React.useState('');
    const [publicKey, setPublicKey] = React.useState('');
    const [privateKey, setPrivateKey] = React.useState('');
    const { toast } = useToast();

    const handleConfirm = () => {
        const words = phrase.trim().split(/\s+/);
        if (!name.trim() || !publicKey.trim() || !privateKey.trim()) {
             toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill all fields.' });
            return;
        }
        if (words.length !== 12) {
            toast({ variant: 'destructive', title: 'Invalid Recovery Phrase', description: 'Recovery phrase must contain exactly 12 words.' });
            return;
        }
        onConfirm(name, phrase, publicKey, privateKey);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Existing Wallet</DialogTitle>
                    <DialogDescription>Enter your wallet details to import it.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="import-wallet-name">Wallet Name</Label>
                        <Input id="import-wallet-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., My Ledger" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="recovery-phrase">Recovery Phrase (12 words)</Label>
                        <Textarea id="recovery-phrase" value={phrase} onChange={(e) => setPhrase(e.target.value)} placeholder="Enter your 12-word phrase, separated by spaces" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="public-key">Public Key / Address</Label>
                        <Input id="public-key" value={publicKey} onChange={(e) => setPublicKey(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="private-key">Private Key</Label>
                        <Input id="private-key" type="password" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleConfirm}>Import Wallet</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function WalletPage() {
  const router = useRouter();
  const { wallets, removeWallet, setPrimaryWallet, addWallet, generateRecoveryPhrase, generatePublicKey } = useWallets();
  const { toast } = useToast();
  const [walletToRemove, setWalletToRemove] = React.useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = React.useState<string | null>(null);
  const { copy } = useCopyToClipboard();
  
  const custodialAccountNumber = 'VEDA89759739911799';

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  
  const handleCreateWallet = (name: string, pin: string) => {
    const newWallet: Omit<Wallet, 'id'> = {
      name,
      pin,
      isPrimary: false,
      recoveryPhrase: generateRecoveryPhrase(),
      publicKey: generatePublicKey(),
    };
    addWallet(newWallet);
    toast({ title: 'Wallet Created!', description: `Wallet "${name}" has been successfully created.` });
    setIsCreateOpen(false);
  };

  const handleImportWallet = (name: string, recoveryPhrase: string, publicKey: string, privateKey: string) => {
     const newWallet: Omit<Wallet, 'id'> = {
      name,
      recoveryPhrase,
      publicKey,
      privateKey,
      isPrimary: false,
    };
    addWallet(newWallet);
    toast({ title: 'Wallet Imported!', description: `Wallet "${name}" has been successfully imported.` });
    setIsImportOpen(false);
  };


  const handleDeleteConfirm = () => {
    if (walletToRemove) {
      removeWallet(walletToRemove);
      setWalletToRemove(null);
    }
  };

  const handleGetPrivateKey = () => {
    toast({
      title: 'Request Received',
      description: 'You will get your private key in mail by 1 hour.',
    });
  };

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
          <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold">Coin Veda Wallet</p>
                            <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Primary</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Coin Veda Account: {custodialAccountNumber}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                        copy(custodialAccountNumber);
                        toast({ title: 'Account Number Copied!' });
                    }}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Non-Custodial Wallets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => setIsCreateOpen(true)}>Create Crypto Wallet</Button>
                    <Button onClick={() => setIsImportOpen(true)}>Import Existing Wallet</Button>
                </div>

                {wallets.length === 0 ? (
                    <div className="text-center py-10 border-t mt-4">
                        <WalletIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Wallets Found</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Create or import a wallet to get started.</p>
                    </div>
                ) : (
                    <Accordion type="single" collapsible className="w-full space-y-4 pt-4 border-t" value={openAccordion} onValueChange={setOpenAccordion}>
                    {wallets.map((wallet) => (
                        <Card key={wallet.id}>
                            <AccordionItem value={wallet.id} className="border-b-0">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div className="font-bold flex items-center gap-2">
                                        {wallet.name}
                                        {wallet.isPrimary && <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Primary</Badge>}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <AccordionTrigger>
                                            <Eye className="h-4 w-4" />
                                        </AccordionTrigger>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {e.stopPropagation(); setWalletToRemove(wallet.id)}}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </CardContent>
                                <AccordionContent className="p-4 pt-0">
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-xs font-semibold">Recovery Phrase</Label>
                                            <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground grid grid-cols-3 gap-x-4 gap-y-2">
                                                {wallet.recoveryPhrase.split(' ').map((word, index) => (
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
                                                <span className="font-mono text-xs break-all text-foreground">{wallet.publicKey}</span>
                                            </div>
                                            <Button variant="outline" size="sm" className="w-full" onClick={handleGetPrivateKey}>Get private key</Button>
                                        </div>
                                    </div>
                                    {!wallet.isPrimary && (
                                        <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setPrimaryWallet(wallet.id)}>
                                            <CheckCircle2 className="mr-2 h-4 w-4"/> Make Primary
                                        </Button>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </Card>
                    ))}
                    </Accordion>
                )}
            </CardContent>
          </Card>
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
      
      <CreateWalletDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onConfirm={handleCreateWallet} />
      <ImportWalletDialog open={isImportOpen} onOpenChange={setIsImportOpen} onConfirm={handleImportWallet} />

    </>
  );
}

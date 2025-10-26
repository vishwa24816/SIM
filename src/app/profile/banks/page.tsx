'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Banknote, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBankAccounts, BankAccount } from '@/hooks/use-bank-accounts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

const indianBanks = [
  "State Bank of India", "HDFC Bank", "ICICI Bank", "Punjab National Bank", "Axis Bank", 
  "Kotak Mahindra Bank", "Bank of Baroda", "Union Bank of India", "Canara Bank", "IndusInd Bank"
];

export default function BanksPage() {
  const router = useRouter();
  const { bankAccounts, addBankAccount, removeBankAccount, setPrimaryAccount } = useBankAccounts();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [accountToRemove, setAccountToRemove] = React.useState<string | null>(null);

  const [bankName, setBankName] = React.useState('');
  const [accountHolderName, setAccountHolderName] = React.useState('');
  const [accountNumber, setAccountNumber] = React.useState('');
  const [ifsc, setIfsc] = React.useState('');

  const handleAddAccount = () => {
    if (!bankName || !accountHolderName || !accountNumber || !ifsc) {
      toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill out all fields.' });
      return;
    }
    const newAccount: BankAccount = {
      id: `acct_${Date.now()}`,
      bankName,
      accountHolderName,
      accountNumber,
      ifsc,
      isPrimary: bankAccounts.length === 0,
    };
    addBankAccount(newAccount);
    toast({ title: 'Account Added', description: `${bankName} has been successfully added.` });
    setIsAddDialogOpen(false);
    // Reset form
    setBankName('');
    setAccountHolderName('');
    setAccountNumber('');
    setIfsc('');
  };
  
  const handleDeleteConfirm = () => {
    if (accountToRemove) {
      removeBankAccount(accountToRemove);
      toast({ title: 'Account Removed', description: 'The bank account has been removed.', variant: 'destructive' });
      setAccountToRemove(null);
    }
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
                <h1 className="text-lg font-semibold">Bank Accounts</h1>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>Add New Account</Button>
            </div>
          </div>
        </header>

        <main className="p-4 space-y-4">
          {bankAccounts.length === 0 ? (
            <div className="text-center py-20">
              <Banknote className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Bank Accounts</h3>
              <p className="mt-1 text-sm text-muted-foreground">Add a bank account to get started.</p>
            </div>
          ) : (
            bankAccounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{account.bankName}</p>
                      {account.isPrimary && <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Primary</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {account.accountNumber.replace(/.(?=.{4})/g, '•')}
                    </p>
                    <p className="text-xs text-muted-foreground">{account.accountHolderName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!account.isPrimary && (
                      <Button variant="outline" size="sm" onClick={() => setPrimaryAccount(account.id)}>
                        Set as Primary
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setAccountToRemove(account.id)}>
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </main>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Bank Account</DialogTitle>
            <DialogDescription>Enter your bank account details. This information will be saved securely.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
               <Select value={bankName} onValueChange={setBankName}>
                <SelectTrigger id="bank-name">
                  <SelectValue placeholder="Select a bank" />
                </SelectTrigger>
                <SelectContent>
                  {indianBanks.map(bank => (
                    <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="account-holder">Account Holder Name</Label>
              <Input id="account-holder" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input id="account-number" type="number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="ifsc-code">IFSC Code</Label>
              <Input id="ifsc-code" value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleAddAccount}>Add Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!accountToRemove} onOpenChange={() => setAccountToRemove(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action will permanently remove this bank account. You cannot undo this action.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setAccountToRemove(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
                      Remove
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

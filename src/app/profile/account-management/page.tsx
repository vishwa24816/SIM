
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, EyeOff, Power, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function AccountManagementPage() {
  const router = useRouter();
  const [isFrozen, setIsFrozen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  return (
    <>
      <div className="bg-background min-h-screen">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-lg font-semibold">Account Management</h1>
            </div>
          </div>
        </header>

        <main className="p-4 space-y-6">
          <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <EyeOff className="w-6 h-6 text-primary" />
                    <div>
                        <CardTitle>Freeze Account</CardTitle>
                        <CardDescription>Temporarily freeze all activities in your account.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <span className="font-medium">Freeze My Account</span>
                    <Switch checked={isFrozen} onCheckedChange={setIsFrozen} />
                </div>
            </CardContent>
          </Card>
          
          <Card className="border-destructive">
             <CardHeader>
                <div className="flex items-center gap-3">
                    <Trash2 className="w-6 h-6 text-destructive" />
                    <div>
                        <CardTitle className="text-destructive">Delete Account</CardTitle>
                        <CardDescription>Permanently delete your account and all associated data. This action is irreversible.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Button variant="destructive" className="w-full" onClick={() => setIsDeleteDialogOpen(true)}>
                    Delete My Account
                </Button>
            </CardContent>
          </Card>

        </main>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => console.log('Account deleted')} className="bg-destructive hover:bg-destructive/90">
                    Yes, delete account
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

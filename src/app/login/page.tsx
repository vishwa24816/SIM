
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons/logo';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M22.56 12.25C22.56 11.45 22.49 10.65 22.36 9.88H12V14.51H18.02C17.73 16.03 16.89 17.32 15.62 18.19V21.09H19.5C21.46 19.29 22.56 16.03 22.56 12.25Z" fill="#4285F4"/>
        <path d="M12 23C14.97 23 17.47 22.02 19.5 20.33L15.62 17.41C14.65 18.05 13.41 18.42 12 18.42C9.17 18.42 6.78 16.53 5.8 13.91H1.83V16.91C3.83 20.61 7.59 23 12 23Z" fill="#34A853"/>
        <path d="M5.8 13.91C5.58 13.26 5.45 12.56 5.45 11.83C5.45 11.1 5.58 10.39 5.8 9.74V6.74H1.83C0.67 9.04 0 11.73 0 14.83C0 17.93 0.67 20.62 1.83 22.92L5.8 19.92V13.91Z" fill="#FBBC05"/>
        <path d="M12 5.58C13.55 5.58 14.93 6.13 15.99 7.15L19.57 3.57C17.47 1.57 14.97 0 12 0C7.59 0 3.83 2.39 1.83 6.09L5.8 9.09C6.78 6.47 9.17 4.58 12 4.58V5.58Z" fill="#EA4335"/>
    </svg>
);

const DeveloperLoginDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
    const router = useRouter();

    const handleLogin = () => {
        router.push('/');
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Developer Login</DialogTitle>
                    <DialogDescription>
                        Use mock credentials to sign in to a simulation or real account.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Tabs defaultValue="simulation" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="simulation">Simulation</TabsTrigger>
                            <TabsTrigger value="real">Real</TabsTrigger>
                        </TabsList>
                        <TabsContent value="simulation" className="mt-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ucc">UCC</Label>
                                    <Input id="ucc" defaultValue="DEMO123" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pin">PIN</Label>
                                    <Input id="pin" type="password" defaultValue="1234" />
                                </div>
                                <Button className="w-full" onClick={handleLogin}>Login</Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="real">
                             <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ucc-real">UCC</Label>
                                    <Input id="ucc-real" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pin-real">PIN</Label>
                                    <Input id="pin-real" type="password" />
                                </div>
                                <Button className="w-full" onClick={handleLogin}>Login</Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
};


export default function LoginPage() {
  const [isDevLoginOpen, setIsDevLoginOpen] = React.useState(false);
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  React.useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        router.push('/');
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setIsSigningIn(false);
    }
  };

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                  <Logo className="h-12 w-12 text-primary" />
              </div>
            <CardTitle className="text-2xl">Welcome to SIM</CardTitle>
            <CardDescription>
              Sign in to access your simulated crypto exchange.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSigningIn}>
              {isSigningIn ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <GoogleIcon className="mr-2 h-5 w-5" />
              )}
              Sign in with Google
            </Button>
             <Button variant="link" className="w-full" onClick={() => setIsDevLoginOpen(true)}>
              Developer Login
            </Button>
          </CardContent>
        </Card>
      </div>
      <DeveloperLoginDialog open={isDevLoginOpen} onOpenChange={setIsDevLoginOpen} />
    </>
  );
}


'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons/logo';
import { useAuth, useFirestore } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { Separator } from '@/components/ui/separator';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M22.56 12.25C22.56 11.45 22.49 10.65 22.36 9.88H12V14.51H18.02C17.73 16.03 16.89 17.32 15.62 18.19V21.09H19.5C21.46 19.29 22.56 16.03 22.56 12.25Z" fill="#4285F4"/>
        <path d="M12 23C14.97 23 17.47 22.02 19.5 20.33L15.62 17.41C14.65 18.05 13.41 18.42 12 18.42C9.17 18.42 6.78 16.53 5.8 13.91H1.83V16.91C3.83 20.61 7.59 23 12 23Z" fill="#34A853"/>
        <path d="M5.8 13.91C5.58 13.26 5.45 12.56 5.45 11.83C5.45 11.1 5.58 10.39 5.8 9.74V6.74H1.83C0.67 9.04 0 11.73 0 14.83C0 17.93 0.67 20.62 1.83 22.92L5.8 19.92V13.91Z" fill="#FBBC05"/>
        <path d="M12 5.58C13.55 5.58 14.93 6.13 15.99 7.15L19.57 3.57C17.47 1.57 14.97 0 12 0C7.59 0 3.83 2.39 1.83 6.09L5.8 9.09C6.78 6.47 9.17 4.58 12 4.58V5.58Z" fill="#EA4335"/>
    </svg>
);

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [formType, setFormType] = React.useState<'login' | 'signup'>('login');
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  React.useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsSigningIn(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Error during Google sign-in:", error);
      setError(error.message);
      setIsSigningIn(false);
    }
  };

  const handleEmailAuth = async (values: z.infer<typeof formSchema>) => {
    if (!auth) return;
    setIsSigningIn(true);
    setError(null);
    try {
      if (formType === 'login') {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      } else {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
      }
    } catch (error: any) {
      console.error(`Error during email ${formType}:`, error);
      setError(error.message);
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src={placeholderImages.logo.src}
              alt={placeholderImages.logo.alt}
              width={48}
              height={48}
              data-ai-hint={placeholderImages.logo['data-ai-hint']}
            />
          </div>
          <CardTitle className="text-2xl">
            {formType === 'login' ? 'Welcome Back' : 'Create an Account'}
          </CardTitle>
          <CardDescription>
            {formType === 'login' 
              ? 'Sign in to access your simulated crypto exchange.'
              : 'Join Coin Veda to start your crypto journey.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailAuth)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <Button type="submit" className="w-full" disabled={isSigningIn}>
                {isSigningIn && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {formType === 'login' ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSigningIn}>
            {isSigningIn && form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <GoogleIcon className="mr-2 h-5 w-5" />
            )}
            Sign in with Google
          </Button>

          <Separator />
          
          <p className="text-center text-sm text-muted-foreground">
            {formType === 'login'
              ? "Don't have an account? "
              : "Already have an account? "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => {
                setFormType(formType === 'login' ? 'signup' : 'login');
                setError(null);
                form.reset();
              }}
            >
              {formType === 'login' ? 'Sign Up' : 'Sign In'}
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

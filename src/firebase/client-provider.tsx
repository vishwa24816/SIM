
'use client';
import { ReactNode, useMemo } from 'react';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { FirebaseProvider } from './provider';
import { firebaseConfig } from './config';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// Initialize Firebase only on the client side, and only once.
if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const value = useMemo(() => {
    return { app, auth, firestore };
  }, []);

  return (
    <FirebaseProvider value={value}>
      {children}
    </FirebaseProvider>
  );
}

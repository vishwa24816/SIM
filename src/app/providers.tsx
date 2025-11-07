
'use client';

import { ThemeProvider } from "@/components/theme-provider";
import { FirebaseClientProvider } from "@/firebase";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <FirebaseClientProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </FirebaseClientProvider>
    );
}

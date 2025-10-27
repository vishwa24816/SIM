
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Wallet } from '@/lib/types';
import { toast } from './use-toast';

interface WalletsState {
    wallets: Wallet[];
    addWallet: (wallet: Omit<Wallet, 'id'>) => void;
    removeWallet: (walletId: string) => void;
    setPrimaryWallet: (walletId: string) => void;
}

const initialWallets: Wallet[] = [
    {
        id: 'wallet_1',
        name: 'My Main Wallet',
        accountId: 'DEMO123',
        type: 'Custodian',
        recoveryPhrase: 'orbit mystery ribbon pizza salt bus afford dash canoe ranch eagle symptom',
        isPrimary: false,
    },
    {
        id: 'wallet_2',
        name: 'Trading Wallet',
        accountId: 'REAL456',
        type: 'Self',
        recoveryPhrase: 'lava acquire lobster vacant junk garlic jungle puzzle harvest absorb valid vendor',
        isPrimary: true,
    }
]

export const useWallets = create<WalletsState>()(
    persist(
        (set) => ({
            wallets: initialWallets,
            addWallet: (wallet) => set((state) => {
                const newWallet: Wallet = {
                    ...wallet,
                    id: `wallet_${Date.now()}`,
                };
                return { wallets: [...state.wallets, newWallet] };
            }),
            removeWallet: (walletId) => set((state) => {
                const walletToRemove = state.wallets.find(w => w.id === walletId);
                if (walletToRemove?.isPrimary) {
                    toast({ variant: 'destructive', title: 'Cannot Remove', description: 'Cannot remove the primary wallet.' });
                    return state;
                }
                return { wallets: state.wallets.filter((wallet) => wallet.id !== walletId) };
            }),
            setPrimaryWallet: (walletId) => set((state) => ({
                wallets: state.wallets.map((wallet) => ({
                    ...wallet,
                    isPrimary: wallet.id === walletId,
                }))
            })),
        }),
        {
            name: 'crypto-wallets-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

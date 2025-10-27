
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Wallet } from '@/lib/types';
import { toast } from './use-toast';

const initialWallets: Wallet[] = [
    {
        id: 'wallet_1',
        name: 'My Main Wallet',
        isPrimary: true,
        recoveryPhrase: 'example recovery phrase one two three four five six seven eight nine',
        publicKey: '0x1234...abcd'
    },
    {
        id: 'wallet_2',
        name: 'Trading Vault',
        isPrimary: false,
        recoveryPhrase: 'another secret key for wallet two that is long and very secure',
        publicKey: '0x5678...efgh'
    }
];

interface WalletsState {
    wallets: Wallet[];
    addWallet: (wallet: Omit<Wallet, 'id'>) => void;
    removeWallet: (walletId: string) => void;
    setPrimaryWallet: (walletId: string) => void;
}

export const useWallets = create<WalletsState>()(
    persist(
        (set) => ({
            wallets: initialWallets,
            addWallet: (wallet) => set((state) => {
                const newWallet = { ...wallet, id: `wallet_${Date.now()}` };
                return { wallets: [...state.wallets, newWallet] };
            }),
            removeWallet: (walletId) => set((state) => {
                const walletToRemove = state.wallets.find(w => w.id === walletId);
                if (walletToRemove?.isPrimary) {
                    toast({
                        variant: 'destructive',
                        title: 'Cannot Remove',
                        description: 'You cannot remove your primary wallet.',
                    });
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

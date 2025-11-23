
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Wallet } from '@/lib/types';
import { toast } from './use-toast';

const wordList = [
    'apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honey',
    'ice', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'peach', 'quince',
    'raspberry', 'strawberry', 'tangerine', 'ugli', 'vanilla', 'watermelon', 'xigua', 'yam'
];

function generateRecoveryPhrase(): string {
    const phrase = new Set<string>();
    while (phrase.size < 12) {
        const word = wordList[Math.floor(Math.random() * wordList.length)];
        phrase.add(word);
    }
    return Array.from(phrase).join(' ');
}

function generatePublicKey(): string {
    return `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
}


const initialWallets: Wallet[] = [
    {
        id: 'wallet_1',
        name: 'My Main Wallet',
        isPrimary: false,
        recoveryPhrase: 'witch collapse practice feed shame open despair creek road again ice least',
        publicKey: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'
    },
    {
        id: 'wallet_2',
        name: 'Trading Vault',
        isPrimary: false,
        recoveryPhrase: 'desert thank remain material lounge fly captain raw master fleet hurry amazing',
        publicKey: '0x51b7a3a59345a18621a22119413994358895c15c'
    }
];

interface WalletsState {
    wallets: Wallet[];
    addWallet: (wallet: Omit<Wallet, 'id'>) => void;
    removeWallet: (walletId: string) => void;
    setPrimaryWallet: (walletId: string) => void;
    generateRecoveryPhrase: () => string;
    generatePublicKey: () => string;
}

export const useWallets = create<WalletsState>()(
    persist(
        (set) => ({
            wallets: initialWallets,
            addWallet: (wallet) => set((state) => {
                const newWallet = { ...wallet, id: `wallet_${Date.now()}` };
                 if (state.wallets.length === 0) {
                    newWallet.isPrimary = true;
                }
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
            generateRecoveryPhrase: generateRecoveryPhrase,
            generatePublicKey: generatePublicKey,
        }),
        {
            name: 'crypto-wallets-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);


'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface BankAccount {
    id: string;
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
    ifsc: string;
    isPrimary: boolean;
}

interface BankAccountsState {
    bankAccounts: BankAccount[];
    addBankAccount: (account: BankAccount) => void;
    removeBankAccount: (accountId: string) => void;
    setPrimaryAccount: (accountId: string) => void;
}

export const useBankAccounts = create<BankAccountsState>()(
    persist(
        (set) => ({
            bankAccounts: [],
            addBankAccount: (account) => set((state) => ({
                bankAccounts: [...state.bankAccounts, account]
            })),
            removeBankAccount: (accountId) => set((state) => {
                const accountToRemove = state.bankAccounts.find(acc => acc.id === accountId);
                const updatedAccounts = state.bankAccounts.filter((account) => account.id !== accountId);

                // If the removed account was primary, set the first remaining account as primary
                if (accountToRemove?.isPrimary && updatedAccounts.length > 0) {
                    updatedAccounts[0].isPrimary = true;
                }

                return { bankAccounts: updatedAccounts };
            }),
            setPrimaryAccount: (accountId) => set((state) => ({
                bankAccounts: state.bankAccounts.map((account) => ({
                    ...account,
                    isPrimary: account.id === accountId,
                }))
            })),
        }),
        {
            name: 'crypto-bank-accounts-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

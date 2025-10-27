
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Transaction } from '@/lib/types';

interface TransactionHistoryState {
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, 'id' | 'platform'>) => void;
}

const initialTransactions: Transaction[] = [
    {
        id: 'tx_1',
        type: 'BUY',
        asset: 'BTC',
        quantity: 0.01,
        priceAtTransaction: 5200000.00,
        totalValue: 52000,
        date: new Date('2024-07-22').toISOString(),
        blockchainId: 'G6LZKRD3',
        brokerage: 52,
        brokerageEarnedBack: 10,
        platform: 'SIM',
    }
];

export const useTransactionHistory = create<TransactionHistoryState>()(
    persist(
        (set) => ({
            transactions: initialTransactions,
            addTransaction: (transaction) => set((state) => ({
                transactions: [
                    { 
                        ...transaction, 
                        id: `tx_${Date.now()}`,
                        platform: 'SIM',
                    },
                    ...state.transactions
                ]
            })),
        }),
        {
            name: 'crypto-transaction-history-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

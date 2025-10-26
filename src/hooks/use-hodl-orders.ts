
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { HodlOrder } from '@/lib/types';

interface HodlOrdersState {
    orders: HodlOrder[];
    addOrder: (order: HodlOrder) => void;
    removeOrder: (orderId: string) => void;
}

export const useHodlOrders = create<HodlOrdersState>()(
    persist(
        (set) => ({
            orders: [],
            addOrder: (order) => set((state) => ({
                orders: [...state.orders, order]
            })),
            removeOrder: (orderId) => set((state) => ({
                orders: state.orders.filter((order) => order.id !== orderId)
            })),
        }),
        {
            name: 'crypto-hodl-orders-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

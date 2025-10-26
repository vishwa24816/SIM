
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LimitOrder } from '@/lib/types';

interface LimitOrdersState {
    limitOrders: LimitOrder[];
    addLimitOrder: (order: LimitOrder) => void;
    removeLimitOrder: (orderId: string) => void;
    updateLimitOrderStatus: (orderId: string, status: LimitOrder['status']) => void;
}

export const useLimitOrders = create<LimitOrdersState>()(
    persist(
        (set) => ({
            limitOrders: [],
            addLimitOrder: (order) => set((state) => ({
                limitOrders: [...state.limitOrders, order]
            })),
            removeLimitOrder: (orderId) => set((state) => ({
                limitOrders: state.limitOrders.filter((order) => order.id !== orderId)
            })),
            updateLimitOrderStatus: (orderId, status) => set((state) => ({
                limitOrders: state.limitOrders.map((order) =>
                    order.id === orderId ? { ...order, status } : order
                )
            })),
        }),
        {
            name: 'crypto-limit-orders-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

    
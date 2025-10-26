
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Basket, BasketItem } from '@/lib/types';

interface BasketsState {
    baskets: Basket[];
    addToBasket: (basketName: string, item: BasketItem) => void;
    createAndAddToBasket: (basketName: string, item: BasketItem) => void;
    getBasketByName: (name: string) => Basket | undefined;
}

export const useBaskets = create<BasketsState>()(
    persist(
        (set, get) => ({
            baskets: [],
            addToBasket: (basketName, item) => set((state) => {
                const basketExists = state.baskets.some(b => b.name === basketName);
                if (!basketExists) {
                    return state; // Should not happen if using UI correctly
                }
                return {
                    baskets: state.baskets.map(basket => {
                        if (basket.name === basketName) {
                            // Avoid adding duplicates
                            if (basket.items.some(i => i.id === item.id)) {
                                return basket;
                            }
                            return { ...basket, items: [...basket.items, item] };
                        }
                        return basket;
                    })
                };
            }),
            createAndAddToBasket: (basketName, item) => set((state) => {
                 if (state.baskets.some(b => b.name === basketName)) {
                    // If basket already exists, just add the item to it.
                    return {
                        baskets: state.baskets.map(basket => {
                            if (basket.name === basketName) {
                                if (basket.items.some(i => i.id === item.id)) {
                                    return basket;
                                }
                                return { ...basket, items: [...basket.items, item] };
                            }
                            return basket;
                        })
                    }
                }
                const newBasket: Basket = { name: basketName, items: [item] };
                return { baskets: [...state.baskets, newBasket] };
            }),
            getBasketByName: (name: string) => get().baskets.find(b => b.name === name),
        }),
        {
            name: 'crypto-baskets-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

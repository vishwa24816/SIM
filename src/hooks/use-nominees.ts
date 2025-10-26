
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Nominee } from '@/lib/types';
import { toast } from './use-toast';

interface NomineesState {
    nominees: Nominee[];
    addNominee: (nominee: Omit<Nominee, 'id' | 'share'>) => void;
    removeNominee: (nomineeId: string) => void;
    updateNomineeShares: () => void;
}

export const useNominees = create<NomineesState>()(
    persist(
        (set, get) => ({
            nominees: [],
            addNominee: (nominee) => {
                if (get().nominees.length >= 2) {
                    toast({
                        variant: 'destructive',
                        title: 'Limit Reached',
                        description: 'You can add a maximum of two nominees.',
                    });
                    return;
                }
                
                const newNominee: Nominee = {
                    ...nominee,
                    id: `nominee_${Date.now()}`,
                    share: 0, // Initial share, will be updated
                };

                set((state) => ({
                    nominees: [...state.nominees, newNominee]
                }));
                get().updateNomineeShares();
            },
            removeNominee: (nomineeId) => {
                set((state) => ({
                    nominees: state.nominees.filter((nominee) => nominee.id !== nomineeId)
                }));
                 get().updateNomineeShares();
            },
            updateNomineeShares: () => {
                set(state => {
                    const count = state.nominees.length;
                    if (count === 0) return { nominees: [] };
                    const share = 100 / count;
                    return {
                        nominees: state.nominees.map(n => ({...n, share: parseFloat(share.toFixed(2))}))
                    }
                });
            }
        }),
        {
            name: 'crypto-nominees-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

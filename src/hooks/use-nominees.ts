'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Nominee } from '@/lib/types';

interface NomineesState {
    nominees: Nominee[];
    addNominee: (nominee: Nominee) => void;
    removeNominee: (nomineeId: string) => void;
    updateNomineeShare: (nomineeId: string, share: number) => void;
}

export const useNominees = create<NomineesState>()(
    persist(
        (set) => ({
            nominees: [],
            addNominee: (nominee) => set((state) => {
                if (state.nominees.length >= 2) {
                    // In a real app, show a toast or error message
                    console.error("Cannot add more than 2 nominees.");
                    return state;
                }
                return { nominees: [...state.nominees, nominee] };
            }),
            removeNominee: (nomineeId) => set((state) => ({
                nominees: state.nominees.filter((nominee) => nominee.id !== nomineeId)
            })),
            updateNomineeShare: (nomineeId, share) => set((state) => ({
                nominees: state.nominees.map((nominee) =>
                    nominee.id === nomineeId ? { ...nominee, share } : nominee
                )
            })),
        }),
        {
            name: 'crypto-nominees-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

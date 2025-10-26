
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SystematicPlan } from '@/lib/types';

interface SystematicPlansState {
    plans: SystematicPlan[];
    addPlan: (plan: SystematicPlan) => void;
    removePlan: (planId: string) => void;
    updatePlanStatus: (planId: string, status: 'active' | 'paused' | 'cancelled') => void;
}

export const useSystematicPlans = create<SystematicPlansState>()(
    persist(
        (set) => ({
            plans: [],
            addPlan: (plan) => set((state) => ({
                plans: [...state.plans, plan]
            })),
            removePlan: (planId) => set((state) => ({
                plans: state.plans.filter((plan) => plan.id !== planId)
            })),
            updatePlanStatus: (planId, status) => set((state) => ({
                plans: state.plans.map((plan) =>
                    plan.id === planId ? { ...plan, status } : plan
                )
            })),
        }),
        {
            name: 'crypto-sp-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

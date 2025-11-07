
'use client';

import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useMemo } from 'react';
import { SystematicPlan } from '@/lib/types';

export const useSystematicPlans = () => {
    const { user } = useUser();
    const firestore = useFirestore();

    const plansCollection = useMemo(() => {
        if (!user) return null;
        return collection(firestore, `users/${user.uid}/systematicPlans`);
    }, [firestore, user]);

    const { data: plans, isLoading, error } = useCollection<SystematicPlan>(plansCollection);

    const addPlan = async (plan: Omit<SystematicPlan, 'id' | 'userId' | 'createdAt'>) => {
        if (!plansCollection || !user) return;
        await addDoc(plansCollection, {
            ...plan,
            userId: user.uid,
            createdAt: new Date().toISOString(),
        });
    };

    const removePlan = async (planId: string) => {
        if (!plansCollection) return;
        const planDoc = doc(plansCollection, planId);
        await deleteDoc(planDoc);
    };

    const updatePlanStatus = async (planId: string, status: 'active' | 'paused' | 'cancelled') => {
        if (!plansCollection) return;
        const planDoc = doc(plansCollection, planId);
        await updateDoc(planDoc, { status });
    };

    return { plans: plans || [], addPlan, removePlan, updatePlanStatus, isLoading, error };
};

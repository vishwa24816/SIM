
'use client';

import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useMemo } from 'react';

export interface Alert {
    id: string;
    userId: string;
    cryptoId: string;
    cryptoSymbol: string;
    price: number;
    status: 'active' | 'triggered';
    createdAt: string;
}

export const useAlerts = () => {
    const { user } = useUser();
    const firestore = useFirestore();

    const alertsCollection = useMemo(() => {
        if (!user) return null;
        return collection(firestore, `users/${user.uid}/alerts`);
    }, [firestore, user]);

    const { data: alerts, isLoading, error } = useCollection<Alert>(alertsCollection);

    const addAlert = async (alert: Omit<Alert, 'id' | 'userId' | 'createdAt'>) => {
        if (!alertsCollection) return;
        await addDoc(alertsCollection, {
            ...alert,
            userId: user?.uid,
            createdAt: new Date().toISOString(),
        });
    };

    const removeAlert = async (alertId: string) => {
        if (!alertsCollection) return;
        const alertDoc = doc(alertsCollection, alertId);
        await deleteDoc(alertDoc);
    };

    const updateAlertStatus = async (alertId: string, status: 'active' | 'triggered') => {
        if (!alertsCollection) return;
        const alertDoc = doc(alertsCollection, alertId);
        await updateDoc(alertDoc, { status });
    };

    return { alerts: alerts || [], addAlert, removeAlert, updateAlertStatus, isLoading, error };
};


'use client';

import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { HodlOrder } from '@/lib/types';

export const useHodlOrders = () => {
    const { user } = useUser();
    const firestore = useFirestore();

    const ordersCollection = useMemo(() => {
        if (!user) return null;
        return collection(firestore, `users/${user.uid}/hodlOrders`);
    }, [firestore, user]);

    const { data: orders, isLoading, error } = useCollection<HodlOrder>(ordersCollection);

    const addOrder = async (order: Omit<HodlOrder, 'id' | 'userId' | 'createdAt'>) => {
        if (!ordersCollection || !user) return;
        const newOrder = {
            ...order,
            userId: user.uid,
            createdAt: new Date().toISOString(),
        };
        await addDoc(ordersCollection, newOrder);
    };

    const removeOrder = async (orderId: string) => {
        if (!ordersCollection) return;
        const orderDoc = doc(ordersCollection, orderId);
        await deleteDoc(orderDoc);
    };

    return { orders: orders || [], addOrder, removeOrder, isLoading, error };
};

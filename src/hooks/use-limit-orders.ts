
'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { LimitOrder } from '@/lib/types';

export const useLimitOrders = () => {
    const { user } = useUser();
    const firestore = useFirestore();

    const ordersCollection = useMemoFirebase(() => {
        if (!user) return null;
        return collection(firestore, `users/${user.uid}/limitOrders`);
    }, [firestore, user]);

    const { data: limitOrders, isLoading, error } = useCollection<LimitOrder>(ordersCollection);

    const addLimitOrder = async (order: Omit<LimitOrder, 'id' | 'userId' | 'createdAt'>) => {
        if (!ordersCollection || !user) return;
        await addDoc(ordersCollection, {
            ...order,
            userId: user.uid,
            createdAt: new Date().toISOString(),
        });
    };

    const removeLimitOrder = async (orderId: string) => {
        if (!ordersCollection) return;
        const orderDoc = doc(ordersCollection, orderId);
        await deleteDoc(orderDoc);
    };

    const updateLimitOrderStatus = async (orderId: string, status: LimitOrder['status']) => {
        if (!ordersCollection) return;
        const orderDoc = doc(ordersCollection, orderId);
        await updateDoc(orderDoc, { status });
    };

    return { limitOrders: limitOrders || [], addLimitOrder, removeLimitOrder, updateLimitOrderStatus, isLoading, error };
};

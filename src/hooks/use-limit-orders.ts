
'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { LimitOrder } from '@/lib/types';

export const useLimitOrders = () => {
    const { user } = useUser();
    const firestore = useFirestore();

    const ordersCollection = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/limitOrders`);
    }, [firestore, user]);

    const { data: limitOrders, isLoading, error } = useCollection<LimitOrder>(ordersCollection);

    const addLimitOrder = async (order: Omit<LimitOrder, 'id' | 'userId' | 'createdAt'>) => {
        if (!ordersCollection || !user) return;
        
        const newOrder: any = {
            ...order,
            userId: user.uid,
            createdAt: new Date().toISOString(),
        };

        // Remove undefined fields to prevent Firestore errors
        if (newOrder.stopLoss === undefined) delete newOrder.stopLoss;
        if (newOrder.takeProfit === undefined) delete newOrder.takeProfit;
        if (newOrder.trailingStopLoss === undefined) delete newOrder.trailingStopLoss;


        await addDoc(ordersCollection, newOrder);
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

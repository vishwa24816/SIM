
'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Basket, BasketItem } from '@/lib/types';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export const useBaskets = () => {
    const { user } = useUser();
    const firestore = useFirestore();

    const basketsCollection = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/baskets`);
    }, [firestore, user]);

    const { data: baskets, isLoading, error } = useCollection<Basket>(basketsCollection);

    const addBasket = async (basketName: string, item: BasketItem) => {
        if (!basketsCollection || !user) return;
        const newBasket: Omit<Basket, 'id'> = {
            name: basketName,
            userId: user.uid,
            items: [item],
            createdAt: new Date().toISOString()
        };
        await addDoc(basketsCollection, newBasket);
    };

    const addToBasket = async (basketName: string, item: BasketItem) => {
        if (!basketsCollection || !baskets) return;
        const basket = baskets.find(b => b.name === basketName);
        if (!basket || !basket.id) return;
        
        const basketDoc = doc(basketsCollection, basket.id);
        await updateDoc(basketDoc, {
            items: arrayUnion(item)
        });
    };
    
    const createAndAddToBasket = async (basketName: string, item: BasketItem) => {
        if (!basketsCollection || !user) return;
        
        const existingBasket = baskets?.find(b => b.name === basketName);

        if (existingBasket && existingBasket.id) {
            const basketDoc = doc(basketsCollection, existingBasket.id);
            await updateDoc(basketDoc, {
                items: arrayUnion(item)
            });
        } else {
             const newBasket: Omit<Basket, 'id'> = {
                name: basketName,
                userId: user.uid,
                items: [item],
                createdAt: new Date().toISOString()
            };
            await addDoc(basketsCollection, newBasket);
        }
    };


    const removeBasket = async (basketId: string) => {
        if (!basketsCollection) return;
        const basketDoc = doc(basketsCollection, basketId);
        await deleteDoc(basketDoc);
    };
    
    const getBasketByName = (name: string) => {
        return baskets?.find(b => b.name === name);
    };


    return { baskets: baskets || [], addBasket, addToBasket, removeBasket, createAndAddToBasket, getBasketByName, isLoading, error };
};

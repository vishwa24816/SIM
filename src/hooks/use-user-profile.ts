
'use client';

import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { UserProfile } from '@/lib/types';

export const useUserProfile = () => {
    const { user } = useUser();
    const firestore = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, `users/${user.uid}`);
    }, [firestore, user]);

    const { data: profile, isLoading, error } = useDoc<UserProfile>(userDocRef);

    return { profile, loading: isLoading, error };
};

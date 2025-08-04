// src/hooks/useStoreId.js
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function useStoreId() {
  const [user] = useAuthState(auth);
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    if (!user) {
      setStoreId(null);
      return;
    }
    // Assume storeId = user.uid
    // Or if you want to fetch store doc to confirm:
    const fetchStoreId = async () => {
      try {
        const storeDoc = await getDoc(doc(db, 'stores', user.uid));
        if (storeDoc.exists()) {
          setStoreId(user.uid); // or storeDoc.id or some field
        } else {
          setStoreId(null);
        }
      } catch {
        setStoreId(null);
      }
    };
    fetchStoreId();
  }, [user]);

  return storeId;
}

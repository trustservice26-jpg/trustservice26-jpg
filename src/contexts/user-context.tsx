'use client';

import { type User } from '@/lib/data';
import { getUsersRealtime, seedInitialData } from '@/lib/firestore';
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

interface UserContextType {
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      await seedInitialData(); 
      const unsubscribe = getUsersRealtime((dbUsers) => {
        setUsers(dbUsers);
        setLoading(false);
      });
      return () => unsubscribe();
    };
    
    const unsubscribePromise = initialize();

    return () => {
      unsubscribePromise.then(unsub => unsub && unsub());
    };
  }, []);

  return (
    <UserContext.Provider value={{ users, setUsers, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
}

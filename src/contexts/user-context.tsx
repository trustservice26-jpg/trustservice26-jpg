'use client';

import { type User } from '@/lib/data';
import { getUsers, seedInitialData } from '@/lib/firestore';
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
    const fetchUsers = async () => {
      await seedInitialData();
      const dbUsers = await getUsers();
      setUsers(dbUsers);
      setLoading(false);
    };
    fetchUsers();
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

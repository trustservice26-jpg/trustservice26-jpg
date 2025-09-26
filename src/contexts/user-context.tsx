'use client';

import { users as initialUsers, type User } from '@/lib/data';
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface UserContextType {
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers);

  return (
    <UserContext.Provider value={{ users, setUsers }}>
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

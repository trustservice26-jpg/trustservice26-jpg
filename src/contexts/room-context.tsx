'use client';

import { type Room } from '@/lib/data';
import { getRoomsRealtime } from '@/lib/firestore';
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

interface RoomContextType {
  rooms: Room[];
  setRooms: Dispatch<SetStateAction<Room[]>>;
  loading: boolean;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getRoomsRealtime((dbRooms) => {
      setRooms(dbRooms);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <RoomContext.Provider value={{ rooms, setRooms, loading }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRooms() {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRooms must be used within a RoomProvider');
  }
  return context;
}

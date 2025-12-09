"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const OnlineCtx = createContext<Set<string>>(new Set());

export const OnlineProvider = ({ children }: { children: React.ReactNode }) => {
  const [online, setOnline] = useState<Set<string>>(new Set());
  const [socket] = useState<Socket>(() => io(window.location.origin, { transports: ['websocket'] }));

  useEffect(() => {
    socket.on('user_online',  (id: string) => setOnline(prev => new Set(prev).add(id)));
    socket.on('user_offline', (id: string) =>
      setOnline(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      })
    );
    return () => { socket.disconnect(); };
  }, [socket]);

  return <OnlineCtx.Provider value={online}>{children}</OnlineCtx.Provider>;
};

export const useOnline = () => useContext(OnlineCtx);
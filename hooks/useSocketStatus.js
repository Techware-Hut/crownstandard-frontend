// hooks/useSocketStatus.js
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Assume you have access to the logged-in user's ID
const currentUserId = '6936aef599ee79647e83a5fe'; 
const socket = io(process.env.NEXT_PUBLIC_API_URL, {
   query: {
        userId: currentUserId
    } ,
    // We still keep withCredentials: true just in case we need other cookies later.
    withCredentials: true,
});

export function useSocketStatus() {
    // Set stores the IDs of all users currently online
    const [onlineUsers, setOnlineUsers] = useState(new Set());

    useEffect(() => {
        // Initial status from the server
        socket.on('initial:status', (data) => {
            setOnlineUsers(new Set(data.onlineUsers));
            console.log('Initial online users:', data.onlineUsers);
        });

        // User comes online
        socket.on('user:status:online', (data) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.add(data.userId);
                return newSet;
            });
        });

        // User goes offline
        socket.on('user:status:offline', (data) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.userId);
                return newSet;
            });
        });

        return () => {
            // Clean up listeners on unmount
            socket.off('initial:status');
            socket.off('user:status:online');
            socket.off('user:status:offline');
            // Do NOT disconnect the socket here if you want it to persist across pages/components
        };
    }, []);

    return { onlineUsers };
}
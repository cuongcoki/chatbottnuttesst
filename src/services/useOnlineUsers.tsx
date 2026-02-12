import { useEffect, useState } from 'react';
import { socketService } from '@/services/socket';

export interface OnlineUser {
  userId: string;
  username?: string;
  full_name?: string;
  role: string;
  isOnline: boolean;
  lastSeenAt?: string;
}

interface LastSeenUser {
  userId: string;
  lastSeenAt: string;
}

export const useOnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [lastSeenMap, setLastSeenMap] = useState<Map<string, string>>(new Map());
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    if (!socketService.isConnected()) return;

    // ✅ Listen for online users list + last seen
    const handleOnlineList = (data: { 
      users: OnlineUser[]; 
      lastSeenUsers?: LastSeenUser[];
    }) => {
      // console.log('👥 Online users:', data.users);
      setOnlineUsers(data.users);
      setOnlineCount(data.users.length);

      // ✅ Update last seen map
      if (data.lastSeenUsers) {
        const newMap = new Map<string, string>();
        data.lastSeenUsers.forEach((item) => {
          newMap.set(item.userId, item.lastSeenAt);
        });
        setLastSeenMap(newMap);
      }
    };

    // Listen for user online
    const handleUserOnline = (data: OnlineUser) => {
      // console.log('✅ User online:', data);
      setOnlineUsers((prev) => {
        if (prev.some((u) => u.userId === data.userId)) {
          return prev;
        }
        return [...prev, { ...data, isOnline: true }];
      });
      setOnlineCount((prev) => prev + 1);

      // ✅ Remove from last seen map
      setLastSeenMap((prev) => {
        const newMap = new Map(prev);
        newMap.delete(data.userId);
        return newMap;
      });
    };

    // ✅ Listen for user offline với lastSeenAt
    const handleUserOffline = (data: { 
      userId: string; 
      lastSeenAt: string;
    }) => {
      // console.log('❌ User offline:', data);
      setOnlineUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      setOnlineCount((prev) => Math.max(0, prev - 1));

      // ✅ Add to last seen map
      setLastSeenMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(data.userId, data.lastSeenAt);
        return newMap;
      });
    };

    // Register listeners
    socketService.on('users:online-list', handleOnlineList);
    socketService.on('user:online', handleUserOnline);
    socketService.on('user:offline', handleUserOffline);

    // Request online users on mount
    socketService.emit('users:get-online');

    return () => {
      socketService.off('users:online-list', handleOnlineList);
      socketService.off('user:online', handleUserOnline);
      socketService.off('user:offline', handleUserOffline);
    };
  }, []);

  const isUserOnline = (userId: string): boolean => {
    return onlineUsers.some((u) => u.userId === userId);
  };

  // ✅ Get last seen của user
  const getLastSeen = (userId: string): string | undefined => {
    const onlineUser = onlineUsers.find((u) => u.userId === userId);
    if (onlineUser?.isOnline) {
      return onlineUser.lastSeenAt;
    }
    return lastSeenMap.get(userId);
  };

  return {
    onlineUsers,
    onlineCount,
    isUserOnline,
    getLastSeen, // ✅ Export function
  };
};
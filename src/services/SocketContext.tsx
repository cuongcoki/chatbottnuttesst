import React, { useEffect, useState } from 'react';
import { socketService } from '@/services/socket';
import { useAuthStore } from '@/utility/stores/authStore';
import { SocketContext } from './useSocket';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to socket
      socketService.connect();

      // Update connection status
      const updateStatus = () => {
        setIsConnected(socketService.isConnected());
      };

      socketService.on('connect', updateStatus);
      socketService.on('disconnect', updateStatus);

      return () => {
        socketService.off('connect', updateStatus);
        socketService.off('disconnect', updateStatus);
      };
    } else {
      // Disconnect when user logs out
      socketService.disconnect();
      setIsConnected(false);
    }
  }, [isAuthenticated, user]);

  const joinClass = (classId: string) => {
    socketService.joinClass(classId);
  };

  const leaveClass = (classId: string) => {
    socketService.leaveClass(classId);
  };

  return (
    <SocketContext.Provider value={{ isConnected, joinClass, leaveClass }}>
      {children}
    </SocketContext.Provider>
  );
};
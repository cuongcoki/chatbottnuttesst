import { useContext } from 'react';
import { createContext } from 'react';

interface SocketContextType {
  isConnected: boolean;
  joinClass: (classId: string) => void;
  leaveClass: (classId: string) => void;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
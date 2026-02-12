import { createContext } from 'react';

interface SocketContextType {
  isConnected: boolean;
  joinClass: (classId: string) => void;
  leaveClass: (classId: string) => void;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);
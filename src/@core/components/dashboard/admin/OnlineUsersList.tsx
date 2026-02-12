import { FC } from 'react';
import { useOnlineUsers } from '@/services/useOnlineUsers';
import { Users, Circle } from 'lucide-react';

const OnlineUsersList: FC = () => {
  const { onlineUsers, onlineCount } = useOnlineUsers();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          Đang hoạt động
        </h3>
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-full">
          {onlineCount} online
        </span>
      </div>

      {/* Online Users List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {onlineUsers.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            Không có ai online
          </p>
        ) : (
          onlineUsers.map((user) => (
            <div
              key={user.userId}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00994C] via-[#008C8C] to-[#0077CC] flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user.full_name?.charAt(0).toUpperCase() || 
                     user.username?.charAt(0).toUpperCase() || 
                     '?'}
                  </span>
                </div>
                {/* Online indicator */}
                <Circle
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-green-500 fill-green-500"
                  strokeWidth={3}
                />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.full_name || user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user.role === 'admin' ? 'Quản trị viên' : 
                   user.role === 'teacher' ? 'Giáo viên' : 
                   'Học sinh'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OnlineUsersList;
import React from 'react';
import { User, UserRole } from '../types';
import { Plus, User as UserIcon, LogOut } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onCreateTask: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onCreateTask,
  onLogout,
}) => {
  const canCreateTask = currentUser.role === 'owner' || currentUser.role === 'admin';

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return '👑';
      case 'admin':
        return '⚙️';
      case 'viewer':
        return '👁️';
      default:
        return '👤';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Task Management Dashboard
            </h1>
          </div>

          {/* Actions and User Info */}
          <div className="flex items-center gap-4">
            {/* Create Task Button */}
            {canCreateTask && (
              <button
                onClick={onCreateTask}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Task</span>
              </button>
            )}

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {/* User Info */}
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-gray-600">Welcome,</span>
                <span className="font-medium text-gray-900">{currentUser.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(currentUser.role)}`}>
                  {getRoleIcon(currentUser.role)} {currentUser.role}
                </span>
              </div>

              {/* Mobile User Info */}
              <div className="sm:hidden flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">{currentUser.name}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

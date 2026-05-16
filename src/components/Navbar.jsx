'use client';

import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 fixed top-0 left-64 right-0 z-10">
      <h1 className="text-lg font-semibold text-gray-800">Supply Management</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-700">{user?.name}</p>
            <p className="text-gray-400 text-xs">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0">
      <nav className="mt-4 px-3 space-y-1">
        <Link
          href="/"
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive('/') 
              ? 'bg-blue-50 text-blue-600' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg
            className={`mr-3 h-5 w-5 ${
              isActive('/') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          Home
        </Link>

        {user?.role === 'ADMIN' && (
          <Link
            href="/users"
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive('/users') 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg
              className={`mr-3 h-5 w-5 ${
                isActive('/users') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
            Usuários
          </Link>
        )}
      </nav>
    </aside>
  );
} 
"use client";

import { Home, PlayCircle, FolderDown, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Courses', href: '/courses', icon: PlayCircle }, // using /courses as a generic link
    { name: 'Resources', href: '/resources', icon: FolderDown },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Simple active check. If it's home, exactly match '/'. Otherwise, check if pathname starts with href.
          const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

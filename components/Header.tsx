"use client";

import { useState } from 'react';
import { Menu, X, Home, BookOpen, LayoutDashboard, Settings, HelpCircle, UserCircle, Bell, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'All Courses', href: '/courses', icon: BookOpen },
    { name: 'My Dashboard', href: '/profile', icon: LayoutDashboard },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Contact Support', href: '/support', icon: HelpCircle },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm z-40 h-16 flex items-center px-4 justify-between transition-colors">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-full transition-colors z-10"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <Link href="/" className="absolute left-0 right-0 flex justify-center items-center">
          <Image 
            src="/logo.png" 
            alt="Shariatpur TTC Logo" 
            width={180} 
            height={40} 
            className="object-contain h-8 w-auto"
            priority
          />
        </Link>
        
        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 rounded-full transition-colors"
          >
            <Sun className="w-5 h-5 hidden dark:block" />
            <Moon className="w-5 h-5 block dark:hidden" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3 font-bold border-b border-gray-100 dark:border-gray-800 dark:text-white">
                    Notifications
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-3 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                      <p className="text-sm font-semibold dark:text-white">New course added</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Web Development basics is now available.</p>
                    </div>
                    <div className="p-3 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                      <p className="text-sm font-semibold dark:text-white">Welcome to Shariatpur TTC!</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Start your learning journey today.</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Drawer */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <UserCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Student Profile</p>
              <p className="text-xs text-gray-500 font-medium">student@sttc.edu</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Icon className="w-5 h-5 text-gray-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-center text-gray-400">
            &copy; {new Date().getFullYear()} Shariatpur TTC
          </p>
        </div>
      </div>
    </>
  );
}

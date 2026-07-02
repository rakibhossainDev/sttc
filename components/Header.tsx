"use client";

import { useState } from 'react';
import { Menu, X, Home, BookOpen, LayoutDashboard, Settings, HelpCircle, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'All Courses', href: '/courses', icon: BookOpen },
    { name: 'My Dashboard', href: '/profile', icon: LayoutDashboard },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Contact Support', href: '/support', icon: HelpCircle },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 shadow-sm z-40 h-16 flex items-center px-4 justify-between">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-full transition-colors z-10"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 absolute left-0 right-0 text-center pointer-events-none">
          Shariatpur TTC
        </h1>
        <div className="w-10"></div>
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

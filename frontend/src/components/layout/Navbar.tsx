"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Bell, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, username, logout } = useAuth();

  const notifications = [
    {
      id: 1,
      text: "New article: Patrick Mahomes sets franchise record",
      time: "2h ago",
    },
    { id: 2, text: "Weekly player stats updated", time: "1d ago" },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/*logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Trophy className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ProCompare</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`${
                    isActive("/dashboard")
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/compare"
                  className={`${
                    isActive("/compare")
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Compare
                </Link>
                <Link
                  href="/favorites"
                  className={`${
                    isActive("/favorites")
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Favorites
                </Link>
                <div className="relative">
                  <button
                    className="text-gray-600 hover:text-gray-900 focus:outline-none"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell size={20} />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {/* notifs */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                      <div className="p-3 border-b border-gray-100">
                        <h3 className="font-medium">Notifications</h3>
                      </div>
                      {notifications.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="p-3 border-b border-gray-100 hover:bg-gray-50"
                            >
                              <p className="text-sm text-gray-800">
                                {notification.text}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No new notifications
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium text-gray-700">
                    {username}
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <LogOut size={18} className="mr-1" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth?mode=login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Log in
                </Link>
                <Link
                  href="/auth?mode=signup"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* responsive oooo aaahhh */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* menu for small screens*/}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/dashboard")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/compare"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/compare")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Compare
                </Link>
                <Link
                  href="/favorites"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/favorites")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Favorites
                </Link>
                <div className="px-3 py-2 font-medium text-gray-700">
                  {username}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth?mode=login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/auth?mode=signup"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

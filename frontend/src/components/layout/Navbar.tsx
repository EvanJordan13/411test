"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Trophy,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  AlertCircle,
  Trash2,
  Users,
  UserSearch,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { userAPI } from "@/lib/api/apiClient";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, username, logout } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const notifications = [
    {
      id: 1,
      text: "New article: Patrick Mahomes sets franchise record",
      time: "2h ago",
    },
    { id: 2, text: "Weekly player stats updated", time: "1d ago" },
  ];

  const isActive = (path: string) => {
    if (path === "/teams" && pathname.startsWith("/teams")) return true;
    if (path === "/players" && pathname.startsWith("/player")) return true;
    if (path === "/dashboard" && pathname === "/") return isAuthenticated;
    return pathname === path;
  };

  const closeAllPopups = () => {
    setIsMenuOpen(false);
    setShowNotifications(false);
    setShowDeleteConfirm(false);
    setDeleteError(null);
  };

  const handleDeleteAccount = async () => {
    if (!username) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await userAPI.deleteUser(username);
      closeAllPopups();
      logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      setDeleteError(
        error instanceof Error
          ? `Deletion failed: ${error.message}`
          : "Could not delete account. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/*logo */}
            <Link
              href={isAuthenticated ? "/dashboard" : "/"}
              className="flex items-center space-x-2"
            >
              <Trophy className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                ProCompare
              </span>
            </Link>

            {/* Desktop/Tablet Links */}
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`text-sm font-medium ${
                      isActive("/dashboard")
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/players"
                    className={`text-sm font-medium ${
                      isActive("/players")
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Players
                  </Link>
                  <Link
                    href="/compare"
                    className={`text-sm font-medium ${
                      isActive("/compare")
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Compare
                  </Link>
                  <Link
                    href="/teams"
                    className={`text-sm font-medium ${
                      isActive("/teams")
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Teams
                  </Link>
                  <Link
                    href="/favorites"
                    className={`text-sm font-medium ${
                      isActive("/favorites")
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Favorites
                  </Link>

                  {/* User Actions Area */}
                  <div className="flex items-center space-x-4">
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
                      {/* notifs dropdown */}
                      {showNotifications && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                          <div className="p-3 border-b border-gray-100">
                            <h3 className="font-medium text-sm">
                              Notifications
                            </h3>
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
                            <div className="p-4 text-center text-sm text-gray-500">
                              No new notifications
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 border-l pl-4">
                      <div className="text-sm font-medium text-gray-700">
                        {username}
                      </div>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Account"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={logout}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                        title="Logout"
                      >
                        <LogOut size={18} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Links for logged-out users
                <>
                  <Link
                    href="/auth?mode=login"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth?mode=signup"
                    className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/dashboard")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={closeAllPopups}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/players"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/players")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={closeAllPopups}
                  >
                    Players
                  </Link>
                  <Link
                    href="/compare"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/compare")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={closeAllPopups}
                  >
                    Compare
                  </Link>
                  <Link
                    href="/teams"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/teams")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={closeAllPopups}
                  >
                    Teams
                  </Link>
                  <Link
                    href="/favorites"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/favorites")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={closeAllPopups}
                  >
                    Favorites
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth?mode=login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={closeAllPopups}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth?mode=signup"
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    onClick={closeAllPopups}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
            {/* Mobile user actions */}
            {isAuthenticated && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4 sm:px-6 mb-3">
                  <User className="h-8 w-8 text-gray-500 mr-3" />
                  <div>
                    <div className="text-base font-medium text-gray-800">
                      {username}
                    </div>
                  </div>
                  {/* Mobile notifications button */}
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="ml-auto bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
                  >
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" aria-hidden="true" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    )}
                  </button>
                </div>

                <div className="mt-3 px-2 space-y-1 sm:px-3">
                  <button
                    onClick={() => {
                      closeAllPopups();
                      logout();
                    }}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => {
                      closeAllPopups();
                      setShowDeleteConfirm(true);
                    }}
                    className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 size={18} className="mr-2" /> Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          {/* Modal Content */}
          <div className="relative mx-auto p-6 border w-full max-w-sm shadow-xl rounded-xl bg-white">
            <div className="text-center">
              {/* Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertCircle
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              {/* Title */}
              <h3
                className="text-lg leading-6 font-semibold text-gray-900"
                id="modal-title"
              >
                Delete Account
              </h3>
              {/* Message */}
              <div className="mt-2 px-2 py-3">
                <p className="text-sm text-gray-600">
                  Are you sure? This action is permanent and cannot be undone.
                  All your data, including favorites and notes, will be lost.
                </p>
                {/* Error Message Area */}
                {deleteError && (
                  <p className="mt-3 text-sm text-red-700 bg-red-100 p-3 rounded-md border border-red-200">
                    {deleteError}
                  </p>
                )}
              </div>
              {/* Buttons */}
              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row-reverse gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm transition-opacity ${
                    isDeleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete Account"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteError(null);
                  }}
                  disabled={isDeleting}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

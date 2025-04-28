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
      const result = await userAPI.deleteUser(username);
      if (result && result.success) {
        closeAllPopups();
        logout();
        router.push("/");
      } else {
        throw new Error("Backend indicated deletion failed.");
      }
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
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Trophy className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                ProCompare
              </span>
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
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} className="mr-2" /> Delete Account
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

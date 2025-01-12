"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { useApi, useNotificationStore } from "@/api";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const refreshTrigger = useNotificationStore((state) => state.refreshTrigger);
  const router = useRouter();
  const { getNotifications } = useApi();

  useEffect(() => {
    console.log("Fetching unread count, refreshTrigger:", refreshTrigger);
    fetchUnreadCount();
  }, [refreshTrigger]);

  const fetchUnreadCount = async () => {
    try {
      const notifications = await getNotifications();
      const unreadNotifications = notifications.filter(
        (notif) => !notif.isRead
      );
      console.log("Unread notifications count:", unreadNotifications.length);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleSearch = () => {
    console.log("Search Term:", searchTerm);
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <SignedOut>
        <div className="bg-blue-500 text-white text-sm flex justify-center items-center px-4 py-2">
          <p className="mr-4">Log in to get your first Bid!</p>
          <button
            className="font-bold underline bg-transparent border-none cursor-pointer text-white"
            onClick={handleSignUp}
          >
            Sign-Up Now
          </button>
        </div>
      </SignedOut>

      <div
        className="flex justify-between items-center px-8"
        style={{ height: "90px" }}
      >
        <div className="flex items-center space-x-6">
          <Link href="/">
            <Image src="/images/logo.jpg" alt="Logo" width={100} height={40} />
          </Link>

          <Link
            href="/products"
            className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2 rounded hover:bg-gray-100"
          >
            Products
          </Link>
          <Link
            href="/about-us"
            className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2 rounded hover:bg-gray-100"
          >
            About Us
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-80 rounded-full border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-gray-300 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M16.5 9.5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link
              href="/sell"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2 rounded hover:bg-gray-100"
            >
              Sell
            </Link>

            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2 rounded hover:bg-gray-100 flex items-center space-x-1"
              >
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span>Notifications</span>
              </button>
              <NotificationDropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                onNotificationRead={fetchUnreadCount}
                refreshTrigger={refreshTrigger}
              />
            </div>

            <Link
              href="/profile"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2 rounded hover:bg-gray-100"
            >
              Profile
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <button
              onClick={handleSignIn}
              className="text-sm font-semibold text-blue-500 hover:text-blue-700"
            >
              Login
            </button>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

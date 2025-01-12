"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    console.log("Search Term:", searchTerm);
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      {/* Blue Banner: Visible only when not logged in */}
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

      {/* Main Navbar */}
      <div
        className="flex justify-between items-center px-8"
        style={{ height: "90px" }}
      >
        {/* Logo Section */}
        <div className="flex items-center space-x-6">
          <Link href="/">
            <Image src="/images/logo.jpg" alt="Logo" width={100} height={40} />
          </Link>

          {/* Products and About Us Links (Always Visible) */}
          <Link
            href="/products"
            className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2 rounded hover:bg-gray-100"
          >
            Products
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2 rounded hover:bg-gray-100"
          >
            About Us
          </Link>
        </div>

        {/* Search Bar */}
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

        {/* User Section */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link
              href="/sell"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2 rounded hover:bg-gray-100"
            >
              Sell
            </Link>
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

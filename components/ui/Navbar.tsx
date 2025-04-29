"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Button from "./Button";

export default function Navbar() {
  const { data: session } = useSession();

  const user = session?.user;
  return (
    <nav className="w-full bg-white shadow-sm p-4 flex justify-between items-center ">
      <Link href="/" className="text-2xl font-bold text-red-600">
        Dubizzle Demo
      </Link>
      <div className="text-center flex items-center">
        {user ? (
          <p className="text-black  text-lg">Welcome, {user.name} 👋</p>
        ) : (
          <p className="text-black text-lg">
            Login now to post your own ads and manage your deals.
          </p>
        )}
      </div>
      <div className="flex gap-4 items-center">
        {session?.user ? (
          <>
            <Link
              href="/ads/new"
              className="text-gray-700 hover:text-red-600 font-semibold"
            >
              Post an Ad
            </Link>
            <Link
              href="/profile"
              className="text-gray-700 hover:text-red-600 font-semibold"
            >
              My Profile
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-gray-700 hover:text-red-600 font-semibold"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-gray-700 hover:text-red-600 font-semibold"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

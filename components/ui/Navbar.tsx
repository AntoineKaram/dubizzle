"use client";

import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaPlusCircle,
  FaShieldAlt,
  FaSignOutAlt,
  FaUser,
  FaXing,
} from "react-icons/fa";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

import Button from "./Button";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);
  return (
    <nav className="fixed top-0 z-50 w-full bg-white shadow-sm border-b px-4 md:px-6 py-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl md:text-2xl font-bold text-red-600">
          Dubizzle Demo
        </Link>
        {pathname === "/" ? (
          user ? (
            <p className="text-black  text-lg">Welcome, {user.name} 👋</p>
          ) : (
            <p className="text-black text-lg">
              Login now to post your own ads and manage your deals.
            </p>
          )
        ) : (
          <></>
        )}
        <button
          className="md:hidden  cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? (
            <FaXing className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
        <div className="hidden md:flex items-center gap-4">
          {user && (
            <>
              <Link href="/ads/new">
                <Button
                  variant="primary"
                  className={`flex items-center gap-2 text-sm px-4 py-2`}
                >
                  <FaPlusCircle className="w-4 h-4" />
                  Post Ad
                </Button>
              </Link>
              {user.role == "MODERATOR" && (
                <Link href="/moderation">
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2 text-sm px-4 py-2"
                  >
                    <FaShieldAlt className="w-4 h-4" />
                    Review
                  </Button>
                </Link>
              )}
            </>
          )}
          {user ? (
            <div className="relative">
              <button
                className="w-9 h-9 rounded-full bg-red-600 text-white font-bold text-sm flex items-center justify-center cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.name?.[0] || "U"}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md overflow-hidden z-50 border text-sm">
                  <Link
                    href="/profile"
                    className="block px-4 py-3 hover:bg-gray-100 text-gray-700 cursor-pointer"
                  >
                    <FaUser className="inline w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-600 cursor-pointer"
                  >
                    <FaSignOutAlt className="inline w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-red-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm text-gray-600 hover:text-red-600 font-medium transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          {user && (
            <>
              <Link href="/ads/new">
                <Button
                  variant="primary"
                  className="w-full flex gap-2 items-center justify-center mb-2"
                >
                  <FaPlusCircle className="w-4 h-4" />
                  Post Ad
                </Button>
              </Link>
              {user.role == "MODERATOR" && (
                <Link href="/moderation">
                  <Button
                    variant="secondary"
                    className="w-full flex gap-2 items-center justify-center mb-2"
                  >
                    <FaShieldAlt className="w-4 h-4" />
                    Review
                  </Button>
                </Link>
              )}
            </>
          )}

          {user ? (
            <>
              <Link
                href="/profile"
                className="block text-center text-gray-700 font-medium"
              >
                My Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-center text-red-600 font-medium cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-gray-700 font-medium">
                Login
              </Link>
              <Link
                href="/register"
                className="block text-gray-700 font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="w-full bg-white shadow-sm p-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-red-600">
        Dubizzle Demo
      </Link>

      <div className="flex gap-4 items-center">
        {session?.user ? (
            <Link href="/profile" className="text-gray-700 hover:text-red-600 font-semibold">
              My Profile
            </Link>
        ) : (
          <>
            <Link href="/login" className="text-gray-700 hover:text-red-600 font-semibold">
              Login
            </Link>
            <Link href="/register" className="text-gray-700 hover:text-red-600 font-semibold">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

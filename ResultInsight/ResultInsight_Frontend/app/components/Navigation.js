"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Navigation = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("user");
    router.push("/");
  };

  const [navOpen, setNavOpen] = useState(false);

  const links = [
    { id: 5, label: "Home", href: "/" },
    {
      id: 4,
      label: "Ranking",
      href: user && user.session ? `/ranking/${user.session}/` : "",
    },
    { id: 1, label: "Session", href: "/session" },
    // Hide Ranking if user is not logged in
    { id: 3, label: "Subjects", href: "/subjects" },
    {
      id: 2,
      label: "Following",
      href: user ? `/user/following/` : "",
    }, // Hide Following if user is not logged in
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 px-6 text-exl font-semibold">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Result<span className="text-yellow-300">Insight</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map(
            ({ id, label, href }) =>
              // Only render links that have a valid href
              href && (
                <Link
                  key={id}
                  href={href}
                  className="hover:text-yellow-300 transition duration-300"
                >
                  {label}
                </Link>
              )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setNavOpen(!navOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* User Authentication Links */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                href={`/user/profile`}
                className="hover:text-blue-300 transition duration-300"
              >
                {user.username}
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 semi  font-semibold rounded-md text-sm bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 py-2 rounded-md text-sm font-medium bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {navOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-gradient-to-r from-blue-600 to-green-600 shadow-lg">
          <ul className="py-4 px-6 space-y-3">
            {links.map(
              ({ id, label, href }) =>
                // Only render links that have a valid href
                href && (
                  <li key={id}>
                    <Link
                      href={href}
                      className="block text-white hover:text-gray-300 transition duration-300"
                      onClick={() => setNavOpen(false)}
                    >
                      {label}
                    </Link>
                  </li>
                )
            )}
          </ul>

          {/* User Authentication Links (Mobile) */}
          <div className="py-3 px-6 space-y-2">
            {isLoggedIn ? (
              <>
                <Link
                  href={`/user/profile`}
                  className="block text-white hover:text-blue-300 transition duration-300"
                >
                  {user.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-sm font-medium bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-sm font-medium bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

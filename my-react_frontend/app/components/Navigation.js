// app/components/Navigation.js
"use client";
// app/components/Navigation.js
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"; // Corrected import
import Cookies from "js-cookie";

const Navigation = () => {
  const { isLoggedIn, logout, user } = useAuth(); // Assuming useAuth provides user information
  const router = useRouter();

  const handleLogout = () => {
    logout();
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("user");

    router.push("/"); // Redirect to the homepage on logout
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="text-white">
            Home
          </Link>
        </li>
        <li>
          <Link href="/all-posts" className="text-white">
            All Posts
          </Link>
        </li>
        {isLoggedIn && (
          <>
            <li>
              <Link href="/user/networkfeed" className="text-white">
                Network Feed
              </Link>
            </li>
            <li>
              <Link href="/user/profile" className="text-white">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/user/followings" className="text-white">
                Followings
              </Link>
            </li>
            <li>
              <Link href="/user/createPost" className="text-white">
                Create Post
              </Link>
            </li>
          </>
        )}
      </ul>
      <div className="flex space-x-4 items-center">
        {isLoggedIn ? (
          <>
            <span className="text-white">{user.username}</span>
            <button onClick={handleLogout} className="text-white">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-white">
              Login
            </Link>
            <Link href="/register" className="text-white">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

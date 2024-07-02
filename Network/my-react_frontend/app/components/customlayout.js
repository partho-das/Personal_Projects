import { Inter } from "next/font/google";
import "@/globals.css";
import "bootstrap/dist/css/bootstrap.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "User Profile",
  description: "Profile",
};

export default function CustomLayout({ children }) {
  return (
    // <html lang="en">
    //   <body className={`${inter.className} bg-white font-red`}>
    <>
      <nav className="flex">
        <ul className="flex list-none">
          <li className="mx-1 sm:mx-2 md:mx-3">ALL Post</li>
          <li className="mx-1 sm:mx-2 md:mx-3">Profile</li>
          <li className="mx-1 sm:mx-2 md:mx-3">Following</li>
          <li className="mx-1 sm:mx-2 md:mx-3">Logout</li>
        </ul>
      </nav>
      {children}
    </>
    //   </body>
    // </html>
  );
}

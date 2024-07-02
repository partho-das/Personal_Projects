import { Inter } from "next/font/google";
import "@/globals.css";
// import "bootstrap/dist/css/bootstrap.css";

import { AuthProvider } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My App",
  description: "My App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>My App</title>
      </head>
      <body className="bg-white">
        <AuthProvider>
          <Navigation />
          <div>
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

export async function middleware(request) {
  const accessToken = request.cookies.get("access")?.value;
  const refreshToken = request.cookies.get("refresh")?.value;
  // console.log(accessToken);
  if (!refreshToken) {
    // Redirect to login if no access token is found
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify the JWT token
    const expirationTime = jwtDecode(refreshToken).exp * 1000;
    const currentTime = new Date();
    if (expirationTime && expirationTime > currentTime) {
      return NextResponse.next();
    } else return NextResponse.redirect(new URL("/login", request.url));
  } catch (error) {
    // Redirect to login if the token is invalid or expired
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Define the protected routes
export const config = {
  matcher: ["/user/:path*"],
};

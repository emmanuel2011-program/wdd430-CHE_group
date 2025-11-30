import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // If there is no token and the person is on the root "/", send it to /register
  if (!token && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  // if there is token and user go to /register, redirect to login
  if (token && req.nextUrl.pathname === "/register") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
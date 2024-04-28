import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req, res) {
  if (req.nextUrl.pathname === "/api/v1/account/signin") {
    return NextResponse.next();
  }

  try {
    const token = req.cookies.toString().replace("token=", "");
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/notification", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    if (req.nextUrl.pathname === "/") {
      return NextResponse.next();
    }
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/", "/api/:path*", "/account/:path*", "/notification:path*"],
};

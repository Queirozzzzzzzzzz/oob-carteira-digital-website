import { NextResponse } from "next/server";
import auth from "models/auth";

export async function middleware(req, res) {
  const pathname = req.nextUrl.pathname;
  const isRootPath = pathname === "/";
  const isSigninPath = pathname === "/api/v1/auth/signin";
  const isAdminPath =
    pathname.startsWith("/admin/") || pathname.startsWith("/api/v1/admin");

  if (isSigninPath) return NextResponse.next();

  try {
    const token = req.cookies.toString().replace("token=", "");
    const result = await auth.getUserPayload(token);

    if (isAdminPath && result.is_admin == 0)
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    if (isRootPath && result.is_admin == 0)
      return NextResponse.redirect(new URL("/404", req.url));

    if (isRootPath)
      return NextResponse.redirect(new URL("/admin/notification", req.url));

    return NextResponse.next();
  } catch (err) {
    if (!isRootPath) {
      const response =
        req.method === "GET"
          ? NextResponse.redirect(new URL("/", req.url))
          : NextResponse.json({ error: "Access denied" }, { status: 403 });

      response.cookies.delete("token");
      return response;
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/api/:path*", "/admin/:path*"],
};

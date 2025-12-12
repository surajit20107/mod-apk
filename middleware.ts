import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const protectedAdminRoutes = ["/admin/create-app", "/admin/dashboard", "/admin/edit-app"];
  const isProtectedRoute = protectedAdminRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const adminToken = request.cookies.get("adminToken")?.value;
    
    if (!adminToken) {
      const signInUrl = new URL("/admin/signin", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }
  
  const authPages = ["/admin/signin", "/admin/signup"];
  const isAuthPage = authPages.some(page => pathname === page);
  
  if (isAuthPage) {
    const adminToken = request.cookies.get("adminToken")?.value;
    
    if (adminToken) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(function middleware(req: NextRequestWithAuth) {
  const response = NextResponse.next();
  
  // Prevent browser caching of protected pages
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
});

export const config = {
  matcher: [
    "/" // Protects the main Kanban board
  ],
};
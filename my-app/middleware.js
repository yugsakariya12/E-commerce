import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)', // Skip static files and Next.js internals
    '/',                      // Run middleware on index page
    '/(api|trpc)(.*)',        // Run middleware on API routes
  ],
};
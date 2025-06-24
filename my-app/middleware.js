import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  publicRoutes: ['/api/webhook'], // ✅ same public route
});

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',  // ✅ functionally the same matcher
    '/',
    '/(api|trpc)(.*)',
  ],
};

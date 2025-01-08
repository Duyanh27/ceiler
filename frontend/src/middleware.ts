import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Add public routes here
const isPublicRoute = createRouteMatcher([
  '/', // Allow the landing page
  '/sign-in(.*)', // Allow the sign-in page
  '/sign-up(.*)', // Allow the sign-up page
]);

export default clerkMiddleware(async (auth, request) => {
  // Enforce authentication for protected routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|.*\\.(?:html?|css|js(?:on)?|png|jpg|webp|svg|gif|woff2?|ttf|ico|json|csv)).*)',
    // Always include API routes
    '/(api|trpc)(.*)',
  ],
};
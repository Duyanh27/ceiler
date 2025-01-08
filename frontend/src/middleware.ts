import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Add public routes here
const isPublicRoute = createRouteMatcher([
  '/', // Allow the landing page
  '/sign-in(.*)', // Allow the sign-in page
  '/sign-up(.*)', // Allow the sign-up page
]);

export default clerkMiddleware(async (auth, request) => {
  // If the route is not public, enforce authentication
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)', // Always run for API routes
  ],
};
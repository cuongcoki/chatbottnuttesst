// router/Router.tsx
import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, RouteObject } from "react-router";

// Import route configurations
import { authRoutes } from "./authRoutes";
import { appRoutes } from "./appRoutes";

// Lazy load 404 page
const ErrorPage = lazy(() => import("@views/pages/misc/Error"));
const BlankLayout = lazy(() => import("@core/layouts/BlankLayout"));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-light to-secondary dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
    <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-8 text-center">
      {/* Loading Spinner */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
      <p className="text-white dark:text-gray-100 font-medium">Loading...</p>
    </div>
  </div>
);

// All routes combined
const routes: RouteObject[] = [
  // Auth routes
  ...authRoutes,

  // App routes
  ...appRoutes,

  // 404 - Not Found (Must be last)
  {
    path: "*",
    element: (
      <BlankLayout>
        <ErrorPage
          errorCode="404"
          title="Page Not Found"
          message="The page you're looking for doesn't exist."
        />
      </BlankLayout>
    ),
  },
];

// Create router
const router = createBrowserRouter(routes);

// Router component
const Router = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default Router;
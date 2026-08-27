import { Outlet, createRootRoute } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { reportLovableError } from "@/lib/lovable-error-reporting";

type RouterContext = {
  queryClient: import("@tanstack/react-query").QueryClient;
};

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="mt-2 text-muted-foreground">Page not found</p>
        </div>
      </div>
    );
  },
  errorComponent: ({ error }) => {
    reportLovableError(error);
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Something went wrong!</h1>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  },
});

function RootComponent() {
  const context = Route.useRouteContext() as RouterContext;

  return (
    <QueryClientProvider client={context.queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}

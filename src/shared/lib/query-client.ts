import { QueryClient } from "@tanstack/react-query";

export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes (eliminates repeated requests during browsing)
        gcTime: 15 * 60 * 1000, // 15 minutes in memory cache
        refetchOnWindowFocus: false,
        retry: (failureCount, error: any) => {
          // Never retry permanent client errors like 404, 401, 403
          const status = error?.status || error?.response?.status;
          if (status === 404 || status === 401 || status === 403) return false;
          // Gracefully retry temporary overload (429, 503, 502) up to 2 times
          return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1200 * (attemptIndex + 1), 3000),
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

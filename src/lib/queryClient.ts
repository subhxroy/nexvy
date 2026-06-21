import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { useToastStore } from '../stores/useToastStore';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      useToastStore.getState().showToast(error.message || 'Network request failed', 'error');
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      useToastStore.getState().showToast(error.message || 'Operation failed', 'error');
    },
  }),
});


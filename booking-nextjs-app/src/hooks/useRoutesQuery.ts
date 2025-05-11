// hooks/useRoutesQuery.ts
// hooks/useRoutesQuery.ts
import { useInfiniteQuery } from '@tanstack/react-query';

export const fetchRoutes = async ({ pageParam = 1, ...params }) => {
  const query = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach(v => query.append(key, v));
    } else {
      query.append(key, value.toString());
    }
  });

  query.append('page', pageParam.toString());
  query.append('limit', '4');

  const response = await fetch(`/api/routes?${query.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch routes');
  return response.json();
};

export const useRoutesQuery = (params: Record<string, any>, enabled: boolean) => {
  return useInfiniteQuery({
    queryKey: ['routes', params],
    queryFn: ({ pageParam }) => fetchRoutes({ pageParam, ...params }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    enabled,
  });
};
import { useState, useCallback } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  sortBy: string;
  direction: SortDirection;
}

export function useSorting(initialSortBy = 'createdAt', initialDirection: SortDirection = 'desc') {
  const [sort, setSort] = useState<SortConfig>({
    sortBy: initialSortBy,
    direction: initialDirection,
  });

  const handleSort = useCallback((columnId: string) => {
    setSort((prev) => {
      if (prev.sortBy === columnId) {
        return {
          sortBy: columnId,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return {
        sortBy: columnId,
        direction: 'desc',
      };
    });
  }, []);

  return {
    sort,
    handleSort,
  };
}

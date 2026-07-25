import { useState, useCallback } from 'react';

export function usePagination(initialPage = 1, initialPageSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to page 1 on limit change
  }, []);

  return {
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  };
}

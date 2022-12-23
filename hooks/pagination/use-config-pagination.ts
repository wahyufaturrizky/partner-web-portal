import usePagination from "@lucasmogari/react-pagination";

import { UsePaginationProps, UsePaginationType } from "types/pagination";

export function useConfigPagination(props?: UsePaginationProps): UsePaginationType {
  const configPagination = {
    page: 1,
    totalItems: 0,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    ...props,
  };

  return usePagination(configPagination);
}

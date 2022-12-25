interface IUseConfigPagination {
  page?: number,
  itemsPerPage?: number,
  maxPageItems?: number,
  numbers?: boolean,
  arrows?: boolean,
  totalItems?: number,
}

export function useConfigPagination(props?: IUseConfigPagination) {
  const configPagination = {
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
    ...props,
  };

  return {
    configPagination,
  };
}

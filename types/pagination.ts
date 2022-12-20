import React from 'react';

export declare type Page = 'previous' | 'next' | 'gap' | number;
export declare type PageItemProps = {
  disabled?: boolean;
  label?: string;
  'aria-current'?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
export declare type PageItem = {
  current?: boolean;
  disabled?: boolean;
  props: PageItemProps;
  page?: Page;
};
export declare type GoToPageFunction = (page: Page) => void;
export declare type PreviousPageFunction = () => void;
export declare type NextPageFunction = () => void;
export declare type GetPageItemFunction = (page: Page) => PageItem;
export declare type SetTotalItemsFunction = (totalItem: number) => void;
export declare type SetMaxPageItemsFunction = (maxPageItems: number) => void;
export declare type SetItemsPerPageFunction = (itemsPerPage: number) => void;
export declare type PaginationInput = {
  page?: number;
  arrows?: boolean;
  numbers?: boolean;
  totalItems: number;
  itemsPerPage?: number;
  maxPageItems?: number;
};
export declare type Pagination = {
  page: number;
  currentPage: number;
  arrows: boolean;
  numbers: boolean;
  totalItems: number;
  itemsPerPage: number;
  maxPageItems: number;
  size: number;
  toItem: number;
  fromItem: number;
  totalPages: number;
};
export declare type GetPageItemPropsFunction = (
  pageItemIndex: number,
  page: Page,
  props: PageItemProps,
) => {};
export declare type UsePaginationProps = PaginationInput & {
  size?: number;
  toItem?: number;
  fromItem?: number;
  totalPages?: number;
  getPageItemProps?: GetPageItemPropsFunction;
};
export declare type UsePaginationType = Pagination & {
  goTo: GoToPageFunction;
  next: NextPageFunction;
  previous: PreviousPageFunction;
  getPageItem: GetPageItemFunction;
  setTotalItems: SetTotalItemsFunction;
  setItemsPerPage: SetItemsPerPageFunction;
  setMaxPageItems: SetMaxPageItemsFunction;
};

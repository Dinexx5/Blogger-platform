export type paginatedViewModel<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T;
};

export type paginationQuerys = {
  sortDirection: string;
  sortBy: string;
  pageNumber: number;
  pageSize: number;
  searchNameTerm?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

export type paginationQuerysSA = {
  sortDirection: string;
  sortBy: string;
  pageNumber: number;
  pageSize: number;
  searchNameTerm?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
  banStatus?: string;
};

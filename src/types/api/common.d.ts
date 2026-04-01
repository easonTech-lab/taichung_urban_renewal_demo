export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ApiPageData<T> {
  content: T[];
  totalElements: number;
  totalPages?: number;
  size?: number;
  number?: number;
}

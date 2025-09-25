export interface ListAllQueryDTO {
  page: number;
  size: number;
  search_text: string;
  order_by?: string;
  order: 'asc' | 'desc';
  filters?: any;
}

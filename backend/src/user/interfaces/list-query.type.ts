export interface ListQuery {
  sort: string;
  order: 'asc' | 'desc';
  skip: number;
  limit: number;
}

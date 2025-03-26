// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SearchRequest {
  schemas: string[];
  filter: string;
  sortBy: string;
  sortOrder: string;
  startIndex: number;
  count: number;
  id?: string;
  status?: any;
}

export interface Paginated<T> {
  content: T[];
  size: number;
  totalElements: number;
  number: number;
}

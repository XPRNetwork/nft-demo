export const EMPTY_BALANCE = '0 FOOBAR';
export const TOKEN_SYMBOL = 'FOOBAR';
export const TOKEN_CONTRACT = 'xtokens';
export const TOKEN_PRECISION = 6;
export const SHORTENED_TOKEN_PRECISION = 2;
export const DEFAULT_COLLECTION = 'monsters';
export const PAGINATION_LIMIT = 10;

export interface QueryParams {
  collection_name?: string;
  owner?: string;
  state?: string;
  sender?: string;
  seller?: string;
  asset_id?: string;
  template_id?: string;
  limit?: string | number;
  sort?: string;
  order?: string;
  page?: number;
  symbol?: string;
}

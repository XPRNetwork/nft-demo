import NodeFetch from '../utils/node-fetch';
import { Asset } from './assets';
import { Collection } from './templates';

type Price = {
  token_contract: string;
  token_symbol: string;
  token_precision: number;
  median: number | null;
  amount: number;
};

export type Sale = {
  market_contract: string;
  assets_contract: string;
  sale_id: string;
  seller: string;
  buyer: string;
  offer_id: string;
  price: Price;
  listing_price: string;
  listing_symbol: string;
  assets: Asset[];
  collection_name: string;
  collection: Collection;
  maker_marketplace: string;
  taker_marketplace: string;
  is_seller_contract: boolean;
  updated_at_block: string;
  updated_at_time: string;
  created_at_block: string;
  created_at_time: string;
  state: number;
};

export const salesApiService = new NodeFetch<Sale>('/atomicmarket/v1/sales');

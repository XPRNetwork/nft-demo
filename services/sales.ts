import NodeFetch from '../utils/node-fetch';
import { Schema, Collection, Template } from './templates';

type Price = {
  token_contract: string;
  token_symbol: string;
  token_precision: number;
  median: number | null;
  amount: number;
};

export type Asset = {
  contract: string;
  asset_id: string;
  owner: string;
  is_transferable: boolean;
  is_burnable: boolean;
  collection: Collection;
  schema: Schema;
  template: Template;
};

export type Sale = {
  seller: string;
  buyer: string;
  offer_id: string;
  price: Price;
  listing_price: string;
  listing_symbol: string;
  assets: Asset[];
  mutable_data: Record<string, unknown>;
  immutable_data: Record<string, unknown>;
  template_mint: string;
  schema_mint: string;
  collection_mint: string;
  backed_tokens: string[] | [];
  burned_by_account: string | null;
  burned_at_block: string | null;
  burned_at_time: string | null;
  updated_at_block: string;
  updated_at_time: string;
  transferred_at_block: string;
  transferred_at_time: string;
  minted_at_block: string;
  minted_at_time: string;
  data: Record<string, unknown>;
  name: string;
};

export const salesApiService = new NodeFetch<Sale>('/atomicmarket/v1/sales');

import NodeFetch from '../utils/node-fetch';
import { Collection, Schema, Template } from './templates';

export type Asset = {
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
  contract: string;
  asset_id: string;
  owner: string;
  is_transferable: boolean;
  is_burnable: boolean;
  collection: Collection;
  schema: Schema;
  template: Template;
};

export const assetsApiService = new NodeFetch<Asset>('/atomicassets/v1/assets');

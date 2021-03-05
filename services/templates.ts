import NodeFetch from '../utils/node-fetch';

export type SchemaFormat = {
  name: string;
  type: string;
};

export type Schema = {
  schema_name: string;
  format: SchemaFormat[];
  created_at_block: string;
  created_at_time: string;
};

export type Collection = {
  collection_name: string;
  name: string | null;
  img: string | null;
  author: string;
  allow_notify: boolean;
  authorized_accounts: string[];
  notify_accounts: string[] | [];
  market_fee: number;
  created_at_block: string;
  created_at_time: string;
};

type ImmutableData = {
  name: string;
  image: string;
  series: number;
};

export type Template = {
  contract: string;
  collection: Collection;
  schema: Schema;
  name: string;
  template_id: string;
  max_supply: string;
  is_transferable: boolean;
  is_burnable: boolean;
  immutable_data: ImmutableData;
  created_at_time: string;
  created_at_block: string;
  issued_supply: string;
};

export const templatesApiService = new NodeFetch<Template>(
  '/atomicassets/v1/templates'
);

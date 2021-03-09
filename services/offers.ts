import NodeFetch from '../utils/node-fetch';
import { Asset } from './assets';

export type Offer = {
  contract: string;
  offer_id: string;
  sender_name: string;
  recipient_name: string;
  memo: string;
  state: number;
  sender_assets: Asset[];
  recipient_assets: Asset[];
  is_sender_contract: boolean;
  is_recipient_contract: boolean;
  updated_at_block: string;
  updated_at_time: string;
  created_at_block: string;
  created_at_time: string;
};

export const offersApiService = new NodeFetch<Offer>('/atomicassets/v1/offers');

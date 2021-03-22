import NodeFetch from '../utils/node-fetch';
import { Asset } from './assets';
import { toQueryString } from '../utils';
import { getFromApi } from '../utils/browser-fetch';

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

/**
 * Get list of assets that user has listed for sale
 * @param sender The account name of the owner of the assets to look up
 * @returns {Offer[]}
 */

export const getUserOffers = async (sender: string): Promise<Offer[]> => {
  try {
    const queryObject = {
      sender: sender,
      state: '0',
    };
    const queryParams = toQueryString(queryObject);
    const result = await getFromApi<Offer[]>(
      `https://proton.api.atomicassets.io/atomicassets/v1/offers?${queryParams}`
    );

    if (!result.success) {
      throw new Error((result.message as unknown) as string);
    }

    return result.data;
  } catch (e) {
    throw new Error(e);
  }
};

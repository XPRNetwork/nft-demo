import NodeFetch from '../utils/node-fetch';
import { Collection, Schema, Template } from './templates';
import { offersApiService, Offer } from './offers';
import { salesApiService } from './sales';

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
  isForSale?: boolean;
  salePrice?: string;
};

export const assetsApiService = new NodeFetch<Asset>('/atomicassets/v1/assets');

export const getUserAssets = async (owner: string): Promise<Asset[]> => {
  try {
    const myAssetsResults = await assetsApiService.getAll({
      owner,
      limit: 1000, // TODO: Remove when WEB-768 is merged in to add pagination support
    });

    if (!myAssetsResults.success) throw new Error(myAssetsResults.message);

    const allMyOffers = await offersApiService.getAll({
      sender: owner,
      state: '0', // only valid offers
    });

    if (!allMyOffers.success) throw new Error(allMyOffers.message);

    if (!allMyOffers.data || !allMyOffers.data.length) {
      return myAssetsResults.data;
    }

    const myAssetsAndSaleItems = await findMySaleItems(
      myAssetsResults.data,
      allMyOffers.data,
      owner
    );

    return myAssetsAndSaleItems;
  } catch (e) {
    throw new Error(e);
  }
};

const findMySaleItems = async (
  allAssets: Asset[],
  allMyOffers: Offer[],
  owner: string
): Promise<Asset[]> => {
  const assetIdsWithOffers = {};
  allMyOffers.forEach((offer) => {
    offer.sender_assets.forEach((asset) => {
      assetIdsWithOffers[asset.asset_id] = true;
    });
  });
  return Promise.all(
    allAssets.map(async (asset) => {
      let isForSale = false;
      let salePrice = '';
      if (assetIdsWithOffers[asset.asset_id]) {
        isForSale = true;
        const saleForThisAsset = await salesApiService.getAll({
          asset_id: asset.asset_id,
          state: '1', // listed sales
          seller: owner,
        });
        // needs further testing to make sure only one sale item comes up in the API call
        if (saleForThisAsset.data && saleForThisAsset.data.length > 0) {
          salePrice = `${saleForThisAsset.data[0].listing_price} ${saleForThisAsset.data[0].listing_symbol}`;
        }
      }
      return {
        ...asset,
        isForSale,
        salePrice,
      };
    })
  );
};

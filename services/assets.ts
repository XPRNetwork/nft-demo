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

/**
 * Gets a list of all user owned assets and checks whether there are open offers.
 * Mostly used in viewing all your owned assets and see which one is listed for sale at a glance.
 * @param  {string} owner   The account name of the owner of the assets to look up
 * @return {Asset[]}        Returns a list of Assets with an additional "isForSale" flag in each Asset object.
 *                          If it is for sale, will also return the "salePrice" in the Asset object.
 */

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

/**
 * A utility function that loops through a list (array) of open offers and owned assets and
 * to cross references with the sales API to determine which assets are for sale.
 * Mostly used in viewing all your owned assets and see which one is listed for sale at a glance.
 * @param  {Asset[]} allAssets    An array of assets
 * @param  {Offer[]} allMyOffers  An array of all offers for the above assets
 * @param  {string}  owner        The owner of the assets you're trying to look up the sales for
 * @return {Asset[]}              Returns array of Assets with additional 'isForSale' and 'salePrice' flags
 */

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

/**
 * Gets the detail of a specific asset and returns it with a "isForSale" flag
 * Mostly used in checking your own asset detail to determine what details to display (cancel listing, vs put up for sale).
 * @param  {string} assetId The asset id number you're trying to look up
 * @return {Asset}          Returns asset information, with additional flag "isForSale",
 *                          after checking if any listed sales exist for that asset_id
 */

export const getAssetDetails = async (assetId: string): Promise<Asset> => {
  const currentAsset = await assetsApiService.getOne(assetId);
  const saleForThisAsset = await salesApiService.getAll({
    asset_id: assetId,
    state: '1', // listed sales
  });

  let isForSale = false;
  if (saleForThisAsset.data && saleForThisAsset.data.length > 0) {
    isForSale = true;
  }

  return {
    ...currentAsset.data,
    isForSale,
  };
};

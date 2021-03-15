import NodeFetch from '../utils/node-fetch';
import { Collection, Schema, Template } from './templates';
import { offersApiService, Offer } from './offers';
import { salesApiService } from './sales';
import { addPrecisionDecimal } from '../utils';

export type Asset = {
  name: string;
  data: Record<string, unknown>;
  owner: string;
  template: Template;
  asset_id: string;
  saleId?: string;
  mutable_data?: Record<string, unknown>;
  immutable_data?: Record<string, unknown>;
  template_mint?: string;
  schema_mint?: string;
  collection_mint?: string;
  backed_tokens?: string[] | [];
  burned_by_account?: string | null;
  burned_at_block?: string | null;
  burned_at_time?: string | null;
  updated_at_block?: string;
  updated_at_time?: string;
  transferred_at_block?: string;
  transferred_at_time?: string;
  minted_at_block?: string;
  minted_at_time?: string;
  contract?: string;
  is_transferable?: boolean;
  is_burnable?: boolean;
  collection?: Collection;
  schema?: Schema;
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

export const getUserAssets = async (
  owner: string,
  page?: number
): Promise<Asset[]> => {
  try {
    const pageParam = page ? page : 1;
    const myAssetsResults = await assetsApiService.getAll({
      owner,
      page: pageParam,
      limit: 10,
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
          const {
            listing_price,
            listing_symbol,
            price: { token_precision },
          } = saleForThisAsset.data[0];
          salePrice = `${addPrecisionDecimal(
            listing_price,
            token_precision
          )} ${listing_symbol}`;
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
  let salePrice = '';
  let saleId = '';
  if (saleForThisAsset.data && saleForThisAsset.data.length > 0) {
    const [sale] = saleForThisAsset.data;
    const {
      listing_price,
      listing_symbol,
      sale_id,
      price: { token_precision },
    } = sale;
    isForSale = true;
    saleId = sale_id;
    salePrice = `${addPrecisionDecimal(
      listing_price,
      token_precision
    )} ${listing_symbol}`;
  }

  return {
    ...currentAsset.data,
    isForSale,
    salePrice,
    saleId,
  };
};

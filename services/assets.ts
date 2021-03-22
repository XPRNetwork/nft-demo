import NodeFetch from '../utils/node-fetch';
import { Collection, Schema, Template } from './templates';
import { Offer } from './offers';
import { salesApiService, getAssetSale } from './sales';
import { addPrecisionDecimal, toQueryString } from '../utils';
import { getFromApi } from '../utils/browser-fetch';
import { getUserOffers } from './offers';

export type Asset = {
  name: string;
  data: Record<string, unknown>;
  owner: string;
  template: Template;
  asset_id: string;
  saleId: string;
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
 * @param owner The account name of the owner of the assets to look up
 * @param page  The page to look up from atomicassets api if number of assets returned is greater than given limit (default 100)
 * @returns {Asset[]}
 */

export const getUserAssets = async (
  owner: string,
  page?: number
): Promise<Asset[]> => {
  try {
    const pageParam = page ? page : 1;
    const queryObject = {
      owner: owner,
      page: pageParam,
      limit: 10,
    };
    const queryString = toQueryString(queryObject);
    const userAssetsRes = await getFromApi<Asset[]>(
      `https://proton.api.atomicassets.io/atomicassets/v1/assets?${queryString}`
    );

    if (!userAssetsRes.success) {
      throw new Error((userAssetsRes.message as unknown) as string);
    }

    const userOffers = await getUserOffers(owner);

    if (!userOffers || !userOffers.length) {
      return userAssetsRes.data;
    }

    const myAssetsAndSaleItems = await findMySaleItems(
      userAssetsRes.data,
      userOffers,
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
        const saleForThisAsset = await getAssetSale(asset.asset_id, owner);
        // needs further testing to make sure only one sale item comes up in the API call
        if (saleForThisAsset.length && saleForThisAsset.length > 0) {
          const {
            listing_price,
            listing_symbol,
            price: { token_precision },
          } = saleForThisAsset[0];
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

import { Collection, Schema, Template } from './templates';
import { Offer } from './offers';
import { getAssetSale, getAllTemplateSales } from './sales';
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

export type RawPrices = {
  [assetId: string]: {
    rawPrice: string;
    saleId: string;
  };
};

export type SaleIds = {
  [assetId: string]: string;
};

type UserTemplateAssetDetails = {
  assets: Asset[];
  rawPrices: RawPrices;
  saleIds: SaleIds;
};

/**
 * Gets a list of all user owned assets of a specific template
 * Mostly used in viewing all your owned assets and see which one is listed for sale at a glance.
 * @param owner       The account name of the owner of the assets to look up
 * @param templateId  The ID of the template of a group of assets
 * @returns {Asset[]}
 */

const getAllUserAssetsByTemplate = async (
  owner: string,
  templateId: string
): Promise<Asset[]> => {
  try {
    let assets = [];
    let hasResults = true;
    let page = 1;

    while (hasResults) {
      const queryObject = {
        owner,
        page,
        order: 'asc',
        sort: 'template_mint',
        template_id: templateId,
      };
      const queryString = toQueryString(queryObject);
      const result = await getFromApi<Asset[]>(
        `https://proton.api.atomicassets.io/atomicassets/v1/assets?${queryString}`
      );

      if (!result.success) {
        throw new Error((result.message as unknown) as string);
      }

      if (result.data.length === 0) {
        hasResults = false;
      }

      assets = assets.concat(result.data);
      page += 1;
    }

    return assets;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Gets an index of sale IDs organized by asset ID.
 * Mostly used in viewing all your owned assets and see which one is listed for sale at a glance.
 * @param owner       The account name of the owner of the assets to look up
 * @param templateId  The ID of the template of a group of assets
 * @returns {SaleIds} Returns object of sale IDs organized by asset ID
 */

const getSaleIdsByAsset = async (
  owner: string,
  templateId: string
): Promise<SaleIds> => {
  const { assets } = await getAllTemplateSales(templateId, owner);
  const saleIdsByAssetId = {};
  for (const asset of assets) {
    saleIdsByAssetId[asset.assetId] = asset.saleId;
  }
  return saleIdsByAssetId;
};

/**
 * Gets a list of all user owned assets and checks whether there are open offers.
 * Mostly used in viewing all your owned assets and see which one is listed for sale at a glance.
 * @param owner                         The account name of the owner of the assets to look up
 * @param templateId                    The ID of the template of a group of assets
 * @returns {UserTemplateAssetDetails}  Returns array of assets, raw prices organized by asset ID, and sale IDs organized by asset ID
 */

export const getUserTemplateAssets = async (
  owner: string,
  templateId: string
): Promise<UserTemplateAssetDetails> => {
  try {
    const assets = await getAllUserAssetsByTemplate(owner, templateId);
    const userOffers = await getUserOffers(owner);

    if (!userOffers || !userOffers.length) {
      return {
        assets,
        rawPrices: {},
        saleIds: {},
      };
    }

    const saleIdsByAssetId = await getSaleIdsByAsset(owner, templateId);
    const myAssetsAndSaleItems = await findMySaleItems(
      assets,
      userOffers,
      owner
    );

    const pricesByAssetIdRaw = {};
    for (const asset of myAssetsAndSaleItems) {
      const { asset_id, salePrice, saleId } = asset;
      pricesByAssetIdRaw[asset_id] = {
        rawPrice: salePrice.replace(',', ''),
        saleId,
      };
    }

    return {
      assets: myAssetsAndSaleItems,
      rawPrices: pricesByAssetIdRaw,
      saleIds: saleIdsByAssetId,
    };
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Gets a list of all user owned assets and checks whether there are open offers.
 * Mostly used in viewing all your owned assets and see which one is listed for sale at a glance.
 * @param owner         The account name of the owner of the assets to look up
 * @param page          The page to look up from atomicassets api if number of assets returned is greater than given limit (default 100)
 * @returns {Asset[]}   Returns array of Assets with additional 'isForSale' and 'salePrice' flags
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
      order: 'desc',
      sort: 'transferred',
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
  const currentAssetResponse = await getFromApi<Asset>(
    `https://proton.api.atomicassets.io/atomicassets/v1/assets/${assetId}`
  );

  if (!currentAssetResponse.success) {
    throw new Error((currentAssetResponse.message as unknown) as string);
  }

  const saleForThisAsset = await getAssetSale(assetId);

  let isForSale = false;
  let salePrice = '';
  let saleId = '';

  if (saleForThisAsset && saleForThisAsset.length > 0) {
    const [sale] = saleForThisAsset;
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
    ...currentAssetResponse.data,
    isForSale,
    salePrice,
    saleId,
  };
};

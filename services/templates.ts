import { getFromApi } from '../utils/browser-fetch';
import { Sale, getLowestPriceAsset } from './sales';
import { addPrecisionDecimal, toQueryString } from '../utils/';
import {
  TOKEN_SYMBOL,
  DEFAULT_COLLECTION,
  PAGINATION_LIMIT,
} from '../utils/constants';

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
  author: string;
  collection_name: string;
  name?: string | null;
  img?: string | null;
  allow_notify?: boolean;
  authorized_accounts?: string[];
  notify_accounts?: string[] | [];
  market_fee?: number;
  created_at_block?: string;
  created_at_time?: string;
};

type ImmutableData = {
  name: string;
  image: string;
  series: number;
};

export interface Template {
  immutable_data?: ImmutableData;
  template_id?: string;
  contract?: string;
  collection?: Collection;
  schema?: Schema;
  name?: string;
  max_supply?: string;
  is_transferable?: boolean;
  is_burnable?: boolean;
  created_at_time?: string;
  created_at_block?: string;
  issued_supply?: string;
  lowestPrice?: string;
  totalAssets?: string;
  assetsForSale?: string;
}

type GetCollectionOptions = {
  type: string;
  page?: number;
};

export type Account = {
  assets: number;
  collections: Collection[];
  templates: {
    assets: string;
    collection_name: string;
    template_id: string;
  }[];
};

type formatTemplatesWithLowPriceAndAssetCountProps = {
  templateIds: string[];
  templates: Template[];
  assetCountById: {
    [templateId: string]: string;
  };
  assetCountByIdWithHidden: {
    [templateId: string]: string;
  };
  lowPriceById: {
    [templateId: string]: string;
  };
};

/**
 * Get a specific template detail
 * Mostly used in viewing a specific template's detail page
 * @param  {string} collectionName   The name of the collection the template belongs in
 * @param  {string} templateId       The specific template id number you need to look up details for
 * @return {Template[]}              Returns array of templates, most likely will only return one item in the array
 */

export const getTemplateDetails = async (
  collectionName: string,
  templateId: string
): Promise<Template> => {
  try {
    const templateResponse = await getFromApi<Template>(
      `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicassets/v1/templates/${collectionName}/${templateId}`
    );

    if (!templateResponse.success) {
      throw new Error((templateResponse.message as unknown) as string);
    }

    const saleForTemplateAsc = await getLowestPriceAsset(
      collectionName,
      templateId
    );
    const lowestPriceSale = saleForTemplateAsc[0];
    const lowestPrice =
      lowestPriceSale && lowestPriceSale.listing_price
        ? `${addPrecisionDecimal(
            lowestPriceSale.listing_price,
            lowestPriceSale.price.token_precision
          )} ${lowestPriceSale.listing_symbol}`
        : '';

    return {
      ...templateResponse.data,
      lowestPrice,
    };
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Get a list of all templates within a collection
 * Mostly used in viewing all the templates of a collection (i.e. in the homepage or after searching for one collection)
 * @param  {string} type         The name of the collection
 * @param  {string} page         Page number of results to return (defaults to 1)
 * @return {Template[]}          Returns array of templates in that collection
 */

export const getTemplatesByCollection = async ({
  type,
  page,
}: GetCollectionOptions): Promise<Template[]> => {
  try {
    const templatesQueryObject = {
      collection_name: type,
      page: page || 1,
      limit: PAGINATION_LIMIT,
    };

    const templatesQueryParams = toQueryString(templatesQueryObject);
    const templatesResult = await getFromApi<Template[]>(
      `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicassets/v1/templates?${templatesQueryParams}`
    );

    if (!templatesResult.success) {
      const errorMessage =
        typeof templatesResult.error === 'object'
          ? templatesResult.error.message
          : templatesResult.message;
      throw new Error(errorMessage as string);
    }

    return templatesResult.data;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Gets the lowest price of assets for sale for a collection's templates
 * Mostly used to display the lowest price of any of the templates with assets for sale in the collection
 * @param  {string} type               Name of collection that templates belong to
 * @return {Template[]}                Returns array of templates with an additional 'lowestPrice' flag
 */

export const getLowestPricesForAllCollectionTemplates = async ({
  type,
}: {
  type: string;
}): Promise<{ [id: string]: string }> => {
  const statsResults = await getFromApi<{ templates: number }>(
    `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicassets/v1/collections/${type}/stats`
  );

  if (!statsResults.success) {
    const errorMessage =
      typeof statsResults.error === 'object'
        ? statsResults.error.message
        : statsResults.message;
    throw new Error(errorMessage as string);
  }

  const numberOfTemplates = statsResults.data.templates;

  const salesQueryObject = {
    collection_name: type,
    symbol: TOKEN_SYMBOL,
    order: 'desc',
    sort: 'created',
    limit: numberOfTemplates,
  };

  const salesQueryParams = toQueryString(salesQueryObject);
  const salesResult = await getFromApi<Sale[]>(
    `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicmarket/v1/sales/templates?${salesQueryParams}`
  );

  if (!salesResult.success) {
    const errorMessage =
      typeof salesResult.error === 'object'
        ? salesResult.error.message
        : salesResult.message;
    throw new Error(errorMessage as string);
  }

  const lowestPriceByTemplateIds = {};
  for (const sale of salesResult.data) {
    const {
      listing_price,
      assets,
      price: { token_precision },
    } = sale;

    if (!assets.length) {
      continue;
    }

    const {
      template: { template_id },
    } = assets[0];

    lowestPriceByTemplateIds[template_id] = listing_price
      ? `${addPrecisionDecimal(listing_price, token_precision)} ${TOKEN_SYMBOL}`
      : '';
  }

  return lowestPriceByTemplateIds;
};

/**
 * Formats an array of templates with a custom 'lowestPrice' flag
 * Mostly used to display the lowest price of any of the templates with assets for sale in the collection
 * @param  {string} templates         Array of templates to format
 * @param  {string} lowestPrices      Object of a collection's lowest priced assets organized by template ID
 * @return {Template[]}               Returns array of templates with an additional 'lowestPrice' flag
 */

export const formatTemplatesWithPriceData = (
  templates: Template[],
  lowestPrices: { [id: string]: string }
): Template[] =>
  templates.map((template) => ({
    ...template,
    lowestPrice: lowestPrices[template.template_id] || '',
  }));

/***
 * Function returns templates with the following added keys: (used primarily for diaplying user's owned assets in My NFT page)
 *    totalAssets: Total number of assets owned by 'owner'
 *    assetsForSale: Number of assets for sale by 'owner'
 *    lowestPrice: Lowest price of an asset for sale in marketplace
 * @param {string} owner Owner of assets to look up
 * @param {number} page  Reference for pagination if number of template categories (based on owned assets) is greater than number of templates displayed per page
 * @return {Template[]}
 */

export const getTemplatesWithUserAssetCount = async (
  owner: string,
  page: number
): Promise<Template[]> => {
  try {
    const accountResponse = await getFromApi<Account>(
      `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicassets/v1/accounts/${owner}`
    );

    if (!accountResponse.success) {
      throw new Error((accountResponse.message as unknown) as string);
    }

    const accountResponseWithHidden = await getFromApi<Account>(
      `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicassets/v1/accounts/${owner}?hide_offers=true`
    );

    if (!accountResponseWithHidden.success) {
      throw new Error((accountResponseWithHidden.message as unknown) as string);
    }

    const userAssetsByTemplateId = {};
    accountResponse.data.templates.map(({ assets, template_id }) => {
      userAssetsByTemplateId[template_id] = assets;
    });

    const userAssetsWithHiddenByTemplateId = {};
    accountResponseWithHidden.data.templates.map(({ assets, template_id }) => {
      userAssetsWithHiddenByTemplateId[template_id] = assets;
    });

    const templateIds = accountResponse.data.templates
      .map(({ template_id }) => template_id)
      .splice((page - 1) * 10, 10);

    if (!templateIds.length) return [];

    const templates = await getTemplatesFromTemplateIds(templateIds);

    const lowestPricesByTemplateId = await getLowestPricesForAllCollectionTemplates(
      { type: DEFAULT_COLLECTION }
    );

    const templatesWithAssetsForSaleCount = formatTemplatesWithLowPriceAndAssetCount(
      {
        templateIds: templateIds,
        templates: templates,
        assetCountById: userAssetsByTemplateId,
        assetCountByIdWithHidden: userAssetsWithHiddenByTemplateId,
        lowPriceById: lowestPricesByTemplateId,
      }
    );
    return templatesWithAssetsForSaleCount;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Function to add total asset count, assets for sale, and lowest price to template data for each template
 * Used in conjunction with function getTemplatesWithUserAssetCount
 * @param templateIds list of templateIds of templates to add data to
 * @param templates   templates of the template Ids listed in templateIds param
 * @param assetCountById  total number of assets for each template that user owns
 * @param assetCountByIdWithHidden  total number of assets for each template that user owns minus those currently offered for sale
 * @param lowPriceById  lowest price of asset currently on offer for each template
 * @returns {Template[]}
 */

const formatTemplatesWithLowPriceAndAssetCount = ({
  templateIds,
  templates,
  assetCountById,
  assetCountByIdWithHidden,
  lowPriceById,
}: formatTemplatesWithLowPriceAndAssetCountProps) => {
  const templatesWithAssetsForSaleCount = templateIds.map((templateId) => {
    const template = templates.find(({ template_id }) => {
      return templateId == template_id;
    });
    if (template) {
      template.totalAssets = `${assetCountById[templateId]}`;

      const assetsForSale =
        parseInt(assetCountById[templateId]) -
        parseInt(assetCountByIdWithHidden[templateId] || '0');

      template.assetsForSale = `${assetsForSale}`;
      template.lowestPrice = lowPriceById[templateId];
    }
    return template;
  });
  return templatesWithAssetsForSaleCount;
};

/**
 * Function to get templates using an array of tempalte ids as reference
 * @param templateIds templatesIds to grab templates for
 * @returns {Template[]}
 */

export const getTemplatesFromTemplateIds = async (
  templateIds: string[]
): Promise<Template[]> => {
  try {
    const templatesQueryObject = {
      symbol: TOKEN_SYMBOL,
      collection_name: DEFAULT_COLLECTION,
      ids: templateIds.join(','),
    };

    const templatesQueryParams = toQueryString(templatesQueryObject);
    const templatesResponse = await getFromApi<Template[]>(
      `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicassets/v1/templates?${templatesQueryParams}`
    );

    if (!templatesResponse.success) {
      throw new Error((templatesResponse.message as unknown) as string);
    }

    return templatesResponse.data;
  } catch (e) {
    throw new Error(e);
  }
};

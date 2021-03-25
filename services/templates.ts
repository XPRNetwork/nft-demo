import { getFromApi } from '../utils/browser-fetch';
import { Sale, getLowestPriceAsset, getHighestPriceAsset } from './sales';
import { asyncForEach, addPrecisionDecimal, toQueryString } from '../utils/';
import { TOKEN_SYMBOL } from '../utils/constants';

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
  highestPrice?: string;
  totalAssets?: string;
  assetsForSale?: string;
}

type GetCollectionOptions = {
  type: string;
  page?: number;
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
      `https://proton.api.atomicassets.io/atomicassets/v1/templates/${collectionName}/${templateId}`
    );

    if (!templateResponse.success) {
      throw new Error((templateResponse.message as unknown) as string);
    }

    const templateWithLowestHighestPrice = await parseTemplatesForHighLowPrice([
      templateResponse.data,
    ]);

    return templateWithLowestHighestPrice[0];
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
      limit: 10,
    };

    const templatesQueryParams = toQueryString(templatesQueryObject);
    const templatesResult = await getFromApi<Template[]>(
      `https://proton.api.atomicassets.io/atomicassets/v1/templates?${templatesQueryParams}`
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
 * Gets the highest and lowest price of any assets for sale in a list of templates
 * Mostly used to display the highest and lowest price of any of the templates with assets for sale in the collection
 * @param  {Template[]} allTemplates   An array of templates you want to look up the highest/lowest price for
 * @return {Template[]}                Returns array of templates with an additional two flags: 'highestPrice' and 'lowestPrice'
 */

const parseTemplatesForHighLowPrice = async (
  allTemplates: Template[]
): Promise<Template[]> => {
  const templateIdsByPrice = {};

  await asyncForEach(allTemplates, async (template: Template) => {
    const saleForTemplateAsc = await getLowestPriceAsset(
      template.collection.collection_name,
      template.template_id
    );
    const saleForTemplateDesc = await getHighestPriceAsset(
      template.collection.collection_name,
      template.template_id
    );

    const highestPriceSale = saleForTemplateDesc[0];
    const lowestPriceSale = saleForTemplateAsc[0];
    templateIdsByPrice[template.template_id] = {
      highestPrice: highestPriceSale
        ? `${addPrecisionDecimal(
            highestPriceSale.listing_price,
            highestPriceSale.price.token_precision
          )} ${highestPriceSale.listing_symbol}`
        : '',
      lowestPrice: lowestPriceSale
        ? `${addPrecisionDecimal(
            lowestPriceSale.listing_price,
            lowestPriceSale.price.token_precision
          )} ${lowestPriceSale.listing_symbol}`
        : '',
    };
  });

  const allTemplateResultsWithLowestPrice = allTemplates.map((template) => {
    const { lowestPrice, highestPrice } = templateIdsByPrice[
      template.template_id
    ];
    return {
      ...template,
      lowestPrice,
      highestPrice,
    };
  });

  return allTemplateResultsWithLowestPrice;
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
    `https://proton.api.atomicassets.io/atomicassets/v1/collections/${type}/stats`
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
    `https://proton.api.atomicassets.io/atomicmarket/v1/sales/templates?${salesQueryParams}`
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

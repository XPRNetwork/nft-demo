import NodeFetch from '../utils/node-fetch';
import { salesApiService, templateSalesApiService } from './sales';
import { asyncForEach, addPrecisionDecimal } from '../utils/';

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
}

export const templatesApiService = new NodeFetch<Template>(
  '/atomicassets/v1/templates'
);

/**
 * Get a specific template detail
 * Mostly used in viewing a specific template's detail page
 * @param  {string} collectionName   The name of the collection the template belongs in
 * @param  {string} templateId       The specific template id number you need to look up details for
 * @return {Template[]}              Returns array of templates, most likely will only return one item in the array
 */
export const getTemplateDetail = async (
  collectionName: string,
  templateId: string
): Promise<Template> => {
  try {
    const template = await templatesApiService.getOne(
      `${collectionName}/${templateId}`
    );
    if (!template.success) throw new Error(template.message);

    const templateWithLowestHighestPrice = await parseTemplatesForHighLowPrice([
      template.data,
    ]);
    return templateWithLowestHighestPrice[0];
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Get a list of all templates within a collection with their lowest and highest price
 * Mostly used in viewing all the templates of a collection (i.e. in the homepage or after searching for one collection)
 * Also used display the highest and lowest price of any of the templates with assets for sale in the collection
 * @param  {string} collection   The name of the collection
 * @return {Template[]}          Returns array of templates in that collection
 */

export const getTemplatesByCollection = async (
  collection: string,
  page: number
): Promise<Template[] | void> => {
  try {
    const allTemplatesResults = await templatesApiService.getAll({
      collection_name: collection,
      page,
      limit: 10,
    });

    if (!allTemplatesResults.success)
      throw new Error(allTemplatesResults.message as string);

    const allTemplateResultsWithLowestPrice = await parseTemplatesForLowPrice(
      allTemplatesResults.data
    );

    return allTemplateResultsWithLowestPrice;
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
    const saleForTemplateAsc = await salesApiService.getAll({
      collection_name: template.collection.collection_name,
      template_id: template.template_id,
      sort: 'price',
      order: 'asc',
      state: '1', // assets listed for sale
    });
    const saleForTemplateDesc = await salesApiService.getAll({
      collection_name: template.collection.collection_name,
      template_id: template.template_id,
      sort: 'price',
      order: 'desc',
      state: '1', // assets listed for sale
    });

    const highestPriceSale = saleForTemplateDesc.data[0];
    const lowestPriceSale = saleForTemplateAsc.data[0];
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
 * Gets the lowest price of assets for sale in a list of templates
 * Mostly used to display the lowest price of any of the templates with assets for sale in the collection
 * @param  {Template[]} allTemplates   An array of templates you want to look up the lowest price for
 * @return {Template[]}                Returns array of templates with an additional 'lowestPrice' flag
 */

const parseTemplatesForLowPrice = async (
  allTemplates: Template[]
): Promise<Template[]> => {
  const templateIdsByPrice = {};

  await asyncForEach(allTemplates, async (template: Template) => {
    const res = await templateSalesApiService.getAll({
      collection_name: template.collection.collection_name,
      template_id: template.template_id,
      symbol: 'FOOBAR',
      sort: 'price',
      order: 'asc',
      limit: 1,
    });

    let lowestPrice = '';
    if (res.data.length) {
      const {
        listing_price,
        listing_symbol,
        price: { token_precision },
      } = res.data[0];
      lowestPrice = `${addPrecisionDecimal(
        listing_price,
        token_precision
      )} ${listing_symbol}`;
    }

    templateIdsByPrice[template.template_id] = lowestPrice;
  });

  const allTemplateResultsWithLowestPrice = allTemplates.map((template) => {
    const lowestPrice = templateIdsByPrice[template.template_id];
    return {
      ...template,
      lowestPrice,
    };
  });

  return allTemplateResultsWithLowestPrice;
};

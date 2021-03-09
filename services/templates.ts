import NodeFetch from '../utils/node-fetch';
import { salesApiService, Sale } from './sales';

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

export type Template = {
  contract: string;
  collection: Collection;
  schema: Schema;
  name: string;
  template_id: string;
  max_supply: string;
  is_transferable: boolean;
  is_burnable: boolean;
  immutable_data: ImmutableData;
  created_at_time: string;
  created_at_block: string;
  issued_supply: string;
  lowestPrice?: string;
};

export const templatesApiService = new NodeFetch<Template>(
  '/atomicassets/v1/templates'
);

export const getTemplatesByCollection = async (
  collection: string
): Promise<Template[] | void> => {
  try {
    const allTemplatesResults = await templatesApiService.getAll({
      collection_name: collection,
    });

    if (!allTemplatesResults.success)
      throw new Error(allTemplatesResults.message as string);

    const allSalesForCollectionResults = await salesApiService.getAll({
      collection_name: collection as string,
      state: '1', // assets listed for sale
    });

    if (!allSalesForCollectionResults.success)
      throw new Error(allTemplatesResults.message as string);

    if (
      !allSalesForCollectionResults.data ||
      !allSalesForCollectionResults.data.length
    ) {
      return allTemplatesResults.data;
    }

    const allTemplateResultsWithLowestPrice = parseTemplatesForLowestPrice(
      allTemplatesResults.data,
      allSalesForCollectionResults.data
    );

    return allTemplateResultsWithLowestPrice;
  } catch (e) {
    throw new Error(e);
  }
};

const parseTemplatesForLowestPrice = (
  allTemplates: Template[],
  allSales: Sale[]
): Template[] => {
  // this whole section needs further testing once we are able to make sales
  const templateIdsByPrice = {};
  allSales.forEach((sale: Sale) => {
    for (const asset of sale.assets) {
      const templateId = asset.template.template_id;
      if (
        templateIdsByPrice[templateId] &&
        templateIdsByPrice[templateId].price
      ) {
        const currentSaleUpdatedAt = Number(sale.updated_at_time);
        const historySaleUpdatedAt = templateIdsByPrice[templateId].updatedAt;
        if (currentSaleUpdatedAt < historySaleUpdatedAt) {
          continue;
        }
      }
      templateIdsByPrice[templateId] = {
        price: Number(sale.listing_price),
        symbol: sale.listing_symbol,
        updatedAt: Number(sale.updated_at_time),
      };
    }
  });

  const allTemplateResultsWithLowestPrice = allTemplates.map((template) => {
    let lowestPrice = null;
    const templatePrice = templateIdsByPrice[template.template_id];
    if (templatePrice && templatePrice.price) {
      lowestPrice = `${templatePrice.price} ${templatePrice.symbol}`;
    }
    return {
      ...template,
      lowestPrice,
    };
  });

  return allTemplateResultsWithLowestPrice;
};

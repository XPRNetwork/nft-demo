import NodeFetch from '../utils/node-fetch';
import { Asset } from './assets';
import { Collection } from './templates';

type Price = {
  token_contract: string;
  token_symbol: string;
  token_precision: number;
  median: number | null;
  amount: number;
};

export type SaleAsset = {
  saleId: string;
  templateMint: string;
  owner: string;
  salePrice: string;
  saleToken?: string;
};

export type Sale = {
  market_contract: string;
  assets_contract: string;
  sale_id: string;
  seller: string;
  buyer: string;
  offer_id: string;
  price: Price;
  listing_price: string;
  listing_symbol: string;
  assets: Asset[];
  collection_name: string;
  collection: Collection;
  maker_marketplace: string;
  taker_marketplace: string;
  is_seller_contract: boolean;
  updated_at_block: string;
  updated_at_time: string;
  created_at_block: string;
  created_at_time: string;
  state: number;
  asset_serial: string;
};

export const salesApiService = new NodeFetch<Sale>('/atomicmarket/v1/sales');

export const templateSalesApiService = new NodeFetch<Sale>(
  '/atomicmarket/v1/sales/templates'
);

/**
 * Get the fulfilled sales for a specific templates (sales that were successful)
 * Mostly used in viewing sales history of a specific template
 * @param  {string} templateId   The template id of the history you want to look up
 * @return {Sales[]}             Returns an array of Sales for that specific template id
 */

export const getSalesHistoryForTemplate = async (
  templateId: string
): Promise<Sale[]> => {
  try {
    const latestSales = await salesApiService.getAll({
      state: '3', // Valid sale, Sale was bought
      template_id: templateId,
      sort: 'updated',
      order: 'desc',
    });
    if (!latestSales.success) throw new Error(latestSales.message);
    return latestSales.data;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Get the fulfilled sales for a specific asset (sales that were successful)
 * Mostly used in viewing sales history of a specific asset
 * @param  {string} assetId   The asset id of the history you want to look up
 * @return {Sales[]}          Returns an array of Sales for that specific template id
 */

export const getSalesHistoryForAsset = async (
  assetId: string
): Promise<Sale[]> => {
  try {
    const latestSales = await salesApiService.getAll({
      state: '3', // Valid sale, Sale was bought
      asset_id: assetId,
      sort: 'updated',
      order: 'desc',
    });
    if (!latestSales.success) throw new Error(latestSales.message);
    return latestSales.data;
  } catch (e) {
    throw new Error(e);
  }
};

import { NextApiRequest, NextApiResponse } from 'next';
import { templatesApiService } from '../../services/templates';
import { salesApiService, Sale, Asset } from '../../services/sales';

type LatestPriceOfTemplate = {
  price: number;
  updatedAt: number;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { method, query } = req;
  switch (method) {
    case 'POST':
      break;
    case 'PUT':
      break;
    case 'PATCH':
      break;
    default: {
      const { collection } = query;
      try {
        const allTemplatesResults = await templatesApiService.getAll({
          collection_name: collection as string,
        });
        if (!allTemplatesResults.success)
          throw new Error(allTemplatesResults.message);
        const allSalesForCollectionResults = await salesApiService.getAll({
          collection_name: collection as string,
        });
        if (!allSalesForCollectionResults.success)
          throw new Error(allTemplatesResults.message);
        if (
          !allSalesForCollectionResults.data ||
          !allSalesForCollectionResults.data.length
        ) {
          res.status(200).send({ success: true, message: allTemplatesResults });
          return;
        }

        const allTemplateResultsWithLowestPrice = parseTemplatesForLowestPrice(
          allTemplatesResults,
          allSalesForCollectionResults
        );

        res
          .status(200)
          .send({ success: true, message: allTemplateResultsWithLowestPrice });
      } catch (e) {
        res.status(500).send({
          success: false,
          message: e.message || 'Error retrieving templates by collection',
        });
      }
      break;
    }
  }
};

const parseTemplatesForLowestPrice = (allTemplates, allSales) => {
  // this whole section needs further testing once we are able to make sales
  const templateIdsByPrice = {};
  allSales.data.forEach((sale: Sale) => {
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
        updatedAt: Number(sale.updated_at_time),
      };
    }
  });

  const allTemplateResultsWithLowestPrice = allTemplates.data.map(
    (template) => {
      let lowestPrice = null;

      if (
        templateIdsByPrice[template.template_id] &&
        templateIdsByPrice[template.template_id].price
      ) {
        lowestPrice = templateIdsByPrice[template.template_id].price;
      }
      return {
        ...template,
        lowestPrice,
      };
    }
  );

  return allTemplateResultsWithLowestPrice;
};

export default handler;

import { NextApiRequest, NextApiResponse } from 'next';
import { assetsApiService } from '../../services/assets';
import { offersApiService } from '../../services/offers';

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
      const { owner } = query;
      try {
        const myAssetsResults = await assetsApiService.getAll({
          owner: owner as string,
        });
        if (!myAssetsResults.success) throw new Error(myAssetsResults.message);
        const allMyOffers = await offersApiService.getAll({
          sender: owner as string,
          state: '0', // only valid offers
        });
        if (!allMyOffers.success) throw new Error(allMyOffers.message);
        if (!allMyOffers.data || !allMyOffers.data.length) {
          res
            .status(200)
            .send({ success: true, message: myAssetsResults.data });
          return;
        }

        const myAssetsAndSaleItems = findMySaleItems(
          myAssetsResults,
          allMyOffers
        );
        res.status(200).send({ success: true, message: myAssetsAndSaleItems });
      } catch (e) {
        res.status(500).send({
          success: false,
          message: e.message || 'Error retrieving your own collection',
        });
      }
      break;
    }
  }
};

const findMySaleItems = (allAssets, allMyOffers) => {
  const assetIdsWithOffers = {};
  allMyOffers.data.forEach((offer) => {
    offer.sender_assets.forEach((asset) => {
      assetIdsWithOffers[asset.asset_id] = true;
    });
  });
  const allAssetsWithSaleFlag = allAssets.data.map((asset) => {
    let forSale = false;
    if (assetIdsWithOffers[asset.asset_id]) {
      forSale = true;
    }
    return {
      ...asset,
      forSale,
    };
  });

  return allAssetsWithSaleFlag;
};

export default handler;

import { NextApiRequest, NextApiResponse } from 'next';
import { getUserAssets } from '../../services/assets';

interface MyAssetRequest extends NextApiRequest {
  query: {
    owner: string;
    page: string;
  };
}

const handler = async (
  req: MyAssetRequest,
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
      const { owner, page } = query;
      try {
        let pageParam = parseInt(page);
        pageParam = isNaN(pageParam) ? 1 : pageParam;
        const message = await getUserAssets(owner as string, pageParam);
        res.status(200).send({ success: true, message });
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

export default handler;

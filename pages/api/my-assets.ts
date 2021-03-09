import { NextApiRequest, NextApiResponse } from 'next';
import { getUserAssets } from '../../services/assets';

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
        const message = await getUserAssets(owner as string);
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

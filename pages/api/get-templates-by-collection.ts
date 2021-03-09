import { NextApiRequest, NextApiResponse } from 'next';
import { getTemplatesByCollection } from '../../services/templates';

interface TemplateByCollectionReqest extends NextApiRequest {
  query: {
    collection: string;
  };
}

const handler = async (
  req: TemplateByCollectionReqest,
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
        const message = await getTemplatesByCollection(collection);
        res.status(200).send({ success: true, message });
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

export default handler;

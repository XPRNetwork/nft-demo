import { NextApiRequest, NextApiResponse } from 'next';
import { getTemplatesByCollection } from '../../services/templates';

interface TemplateByCollectionRequest extends NextApiRequest {
  query: {
    collection: string;
    page: string;
  };
}

const handler = async (
  req: TemplateByCollectionRequest,
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
      const { collection, page } = query;
      try {
        let pageParam = parseInt(page);
        pageParam = isNaN(pageParam) ? 1 : pageParam;
        const message = await getTemplatesByCollection(collection, pageParam);
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

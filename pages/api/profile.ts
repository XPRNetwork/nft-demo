import { NextApiResponse } from 'next';
import withCache, {
  MyAssetRequest,
  conditionallyUpdateCache,
} from '../../utils/withCache';

const handler = async (
  req: MyAssetRequest,
  res: NextApiResponse
): Promise<void> => {
  const {
    method,
    query: { accounts },
  } = req;
  switch (method) {
    case 'POST':
      break;
    case 'PUT':
      break;
    case 'PATCH':
      break;
    default: {
      try {
        const chainAccounts =
          typeof accounts === 'string' ? [accounts] : [...new Set(accounts)];

        const promises = chainAccounts.map((account) =>
          conditionallyUpdateCache(account, req.cache)
        );
        await Promise.all(promises);

        const avatarsByChainAccount = req.cache.getValues(chainAccounts);
        res.status(200).send({ success: true, message: avatarsByChainAccount });
      } catch (e) {
        res.status(500).send({
          success: false,
          message: e.message || 'Error retrieving profile avatars',
        });
      }
      break;
    }
  }
};

export default withCache(handler);

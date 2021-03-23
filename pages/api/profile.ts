import { NextApiRequest, NextApiResponse } from 'next';
import cache from '../../services/cache';
import proton from '../../services/proton-rpc';

interface MyAssetRequest extends NextApiRequest {
  query: {
    accounts: string[];
  };
}

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

        for (const account of chainAccounts) {
          if (!cache.has(account)) {
            const res = await proton.getProfileImage({ account });

            if (res) {
              cache.set(account, res);
            }
          }
        }

        const avatarsByChainAccount = cache.getValues(chainAccounts);
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

export default handler;

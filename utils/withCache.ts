import { NextApiRequest, NextApiResponse } from 'next';
import proton from '../services/proton-rpc';
import cache, { Cache } from '../services/cache';

export interface MyAssetRequest extends NextApiRequest {
  query: {
    accounts: string[];
  };
  cache: Cache;
}

type Handler = (req: MyAssetRequest, res: NextApiResponse) => Promise<void>;

export const conditionallyUpdateCache = (
  account: string,
  cache: Cache
): Promise<string> =>
  new Promise((resolve) => {
    if (!cache.has(account)) {
      proton.getProfileImage({ account }).then((avatar) => {
        cache.set(account, avatar);
        resolve(avatar);
      });
    } else {
      resolve(account);
    }
  });

const withCache = (handler: Handler): Handler => {
  return async (req, res) => {
    req.cache = cache;
    return handler(req, res);
  };
};

export default withCache;

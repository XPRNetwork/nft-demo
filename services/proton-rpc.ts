import { JsonRpc } from '@proton/js';
import { formatPrice } from '../utils';
import {
  EMPTY_BALANCE,
  TOKEN_SYMBOL,
  TOKEN_PRECISION,
  TOKEN_CONTRACT,
} from '../utils/constants';

class ProtonJs {
  rpc: JsonRpc;

  constructor() {
    this.rpc = null;
  }

  init() {
    return new Promise<void>((initResolve, reject) => {
      this.setRPC(process.env.NEXT_PUBLIC_CHAIN_ENDPOINT)
        .then(() => {
          return this.rpc.get_info();
        })
        .then((result) => {
          if (result) {
            initResolve();
          } else {
            reject(new Error('UNABLE TO CONNECT'));
          }
        })
        .catch((err) => {
          console.warn(err);
          reject(err);
        });
    });
  }

  setRPC = (endpoint) => {
    return new Promise<void>((resolve) => {
      this.rpc = new JsonRpc(endpoint);
      resolve();
    });
  };

  getAccountBalance = async (account): Promise<string> => {
    const balance = await this.rpc.get_currency_balance(
      TOKEN_CONTRACT,
      account,
      TOKEN_SYMBOL
    );
    // return formatPrice(res[0]);
    return balance[0];
  };

  getProfileImage = async ({ account }): Promise<string> => {
    const { rows } = await this.rpc.get_table_rows({
      scope: 'eosio.proton',
      code: 'eosio.proton',
      json: true,
      table: 'usersinfo',
      lower_bound: account,
      upper_bound: account,
    });
    const { avatar } = rows[0];
    return avatar;
  };
}

const proton = new ProtonJs();
proton.init();
export default proton;

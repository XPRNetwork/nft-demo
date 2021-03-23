import { JsonRpc } from '@proton/js';
import { formatPrice } from '../utils';
import { TOKEN_SYMBOL } from '../utils/constants';

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

  getAccountBalance = async (account: string): Promise<string> => {
    const res = await this.rpc.get_currency_balance(
      'xtokens',
      account,
      TOKEN_SYMBOL
    );
    return formatPrice(res[0]);
  };
}

const proton = new ProtonJs();
proton.init();
export default proton;

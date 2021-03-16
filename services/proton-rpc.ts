import { JsonRpc } from '@proton/js';

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

  getProfileImage = async ({ account }): Promise<void> => {
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

  getAtomicMarketBalance = (chainAccount: string) => {
    return new Promise<string>((resolve, _) => {
      this.rpc
        .get_table_rows({
          json: true,
          code: 'atomicmarket',
          scope: 'atomicmarket',
          table: 'balances',
          lower_bound: chainAccount,
          limit: 1,
          reverse: false,
          show_payer: false,
        })
        .then((res) => {
          if (!res.rows.length) {
            throw new Error('No balances found for Atomic Market.');
          }

          const [balance] = res.rows;
          if (balance.owner !== chainAccount || !balance.quantities.length) {
            throw new Error(
              `No Atomic Market balances found for chain account: ${chainAccount}.`
            );
          }

          const [amount] = balance.quantities;
          resolve(amount);
        })
        .catch((err) => {
          console.warn(err);
          resolve('0.0000 XPR');
        });
    });
  };
}

const proton = new ProtonJs();
proton.init();
export default proton;

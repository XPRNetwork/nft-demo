import { ConnectWallet } from '@proton/web-sdk';
import { LinkSession, Link } from '@proton/link';
import logoUrl from '../public/logo.svg';
import { TOKEN_CONTRACT } from '../utils/constants';

export interface User {
  actor: string;
  avatar: string;
  name: string;
  isLightKYCVerified: boolean;
  permission: string;
}

interface CreateSaleOptions {
  seller: string;
  asset_id: string;
  price: string;
  currency: string;
}

interface CreateMultipleSalesOptions
  extends Omit<CreateSaleOptions, 'asset_id'> {
  assetIds: string[];
}

interface PurchaseSaleOptions {
  buyer: string;
  amount: string;
  sale_id: string;
}

interface SaleOptions {
  actor: string;
  sale_id: string;
}

interface CancelMultipleSalesOptions {
  actor: string;
  saleIds: string[];
}

interface DepositWithdrawOptions {
  actor: string;
  amount: string;
}
interface DepositWithdrawResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

interface SaleResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

interface WalletResponse {
  user: User;
  error: string;
}

class ProtonSDK {
  chainId: string;
  endpoints: string[];
  appName: string;
  requestAccount: string;
  session: LinkSession | null;
  link: Link | null;

  constructor() {
    this.chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
    this.endpoints = [process.env.NEXT_PUBLIC_CHAIN_ENDPOINT];
    this.appName = 'Monster NFTs';
    this.requestAccount = 'monsters';
    this.session = null;
    this.link = null;
  }

  connect = async ({ restoreSession }): Promise<void> => {
    const { link, session } = await ConnectWallet({
      linkOptions: {
        chainId: this.chainId,
        endpoints: this.endpoints,
        restoreSession,
      },
      transportOptions: {
        requestAccount: this.requestAccount,
        backButton: true,
      },
      selectorOptions: {
        appName: this.appName,
        appLogo: logoUrl as string,
      },
    });
    this.link = link;
    this.session = session;
  };

  login = async (): Promise<WalletResponse> => {
    try {
      await this.connect({ restoreSession: false });
      if (!this.session || !this.session.auth || !this.session.accountData) {
        throw new Error('An error has occurred while logging in');
      }
      const { auth, accountData } = this.session;
      const profile = accountData
        ? accountData[0]
        : {
            name: '',
            acc: auth.actor,
            avatar: '',
            isLightKYCVerified: false,
          };

      const { avatar, isLightKYCVerified, name } = profile;
      const chainAccountAvatar = avatar
        ? `data:image/jpeg;base64,${avatar}`
        : '/default-avatar.png';

      return {
        user: {
          actor: auth.actor,
          avatar: chainAccountAvatar,
          isLightKYCVerified,
          name,
          permission: auth.permission,
        },
        error: '',
      };
    } catch (e) {
      return {
        user: null,
        error: e.message || 'An error has occurred while logging in',
      };
    }
  };

  logout = async () => {
    await this.link.removeSession(this.requestAccount, this.session.auth);
  };

  restoreSession = async () => {
    try {
      await this.connect({ restoreSession: true });
      if (!this.session || !this.session.auth || !this.session.accountData) {
        throw new Error('An error has occurred while restoring a session');
      }

      const { auth, accountData } = this.session;
      const profile = accountData
        ? accountData[0]
        : {
            name: '',
            acc: auth.actor,
            avatar: '',
            isLightKYCVerified: false,
          };

      const { avatar, isLightKYCVerified, name } = profile;
      const chainAccountAvatar = avatar
        ? `data:image/jpeg;base64,${avatar}`
        : '/default-avatar.png';

      return {
        user: {
          actor: auth.actor,
          avatar: chainAccountAvatar,
          isLightKYCVerified,
          name,
          permission: auth.permission,
        },
        error: '',
      };
    } catch (e) {
      return {
        user: null,
        error: e.message || 'An error has occurred while restoring a session',
      };
    }
  };

  /**
   * Withdraw tokens from the marketplace back into user's account
   *
   * @param {string}   actor                chainAccount of user
   * @param {string}   amount               amount of FOOBAR (will only be using FOOBAR in this demo, i.e 1.000000 FOOBAR)
   * @return {DepositWithdrawResponse}      Returns an object indicating the success of the transaction and transaction ID.
   */

  withdraw = async ({
    actor,
    amount,
  }: DepositWithdrawOptions): Promise<DepositWithdrawResponse> => {
    const action = [
      {
        account: 'atomicmarket',
        name: 'withdraw',
        authorization: [
          {
            actor: actor,
            permission: 'active',
          },
        ],
        data: {
          owner: actor,
          token_to_withdraw: amount,
        },
      },
    ];
    try {
      if (!this.session) {
        throw new Error('Must be logged in to withdraw from the market');
      }

      const result = await this.session.transact(
        { actions: action },
        { broadcast: true }
      );

      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        error:
          e.message ||
          'An error has occured while attempting to withdraw from the market',
      };
    }
  };

  /**
   * Announce an asset sale and create an initial offer for the asset on atomic market.
   *
   * @param {string}   seller     Chain account of the asset's current owner.
   * @param {string}   asset_id   ID of the asset to sell.
   * @param {string}   price      Listing price of the sale (i.e. '1.000000').
   * @param {string}   currency   Token precision (number of decimal points) and token symbol that the sale will be paid in (i.e. '6,FOOBAR').
   * @return {SaleResponse}       Returns an object indicating the success of the transaction and transaction ID.
   */

  createSale = async ({
    seller,
    asset_id,
    price,
    currency,
  }: CreateSaleOptions): Promise<SaleResponse> => {
    const actions = [
      {
        account: 'atomicmarket',
        name: 'announcesale',
        authorization: [
          {
            actor: seller,
            permission: 'active',
          },
        ],
        data: {
          seller,
          asset_ids: [asset_id],
          maker_marketplace: 'fees.market',
          listing_price: price,
          settlement_symbol: currency,
        },
      },
      {
        account: 'atomicassets',
        name: 'createoffer',
        authorization: [
          {
            actor: seller,
            permission: 'active',
          },
        ],
        data: {
          sender: seller,
          recipient: 'atomicmarket',
          sender_asset_ids: [asset_id],
          recipient_asset_ids: [],
          memo: 'sale',
        },
      },
    ];

    try {
      if (!this.session) {
        throw new Error('Unable to create a sale offer without logging in.');
      }

      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );

      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        error:
          e.message || 'An error has occurred while creating the sale offer.',
      };
    }
  };

  /**
   * Announce multiple asset sales and create initial offers for the assets on atomic market.
   *
   * @param {string}   seller     Chain account of the asset's current owner.
   * @param {string[]} assetIds   Array of IDs for the assets to sell.
   * @param {string}   price      Listing price of the sale (i.e. '1.000000').
   * @param {string}   currency   Token precision (number of decimal points) and token symbol that the sale will be paid in (i.e. '6,FOOBAR').
   * @return {SaleResponse}       Returns an object indicating the success of the transaction and transaction ID.
   */

  createMultipleSales = async ({
    seller,
    assetIds,
    price,
    currency,
  }: CreateMultipleSalesOptions): Promise<SaleResponse> => {
    const announceSaleActions = assetIds.map((asset_id) => ({
      account: 'atomicmarket',
      name: 'announcesale',
      authorization: [
        {
          actor: seller,
          permission: 'active',
        },
      ],
      data: {
        seller,
        asset_ids: [asset_id],
        maker_marketplace: 'fees.market',
        listing_price: price,
        settlement_symbol: currency,
      },
    }));

    const createOfferActions = assetIds.map((asset_id) => ({
      account: 'atomicassets',
      name: 'createoffer',
      authorization: [
        {
          actor: seller,
          permission: 'active',
        },
      ],
      data: {
        sender: seller,
        recipient: 'atomicmarket',
        sender_asset_ids: [asset_id],
        recipient_asset_ids: [],
        memo: 'sale',
      },
    }));

    const actions = [...announceSaleActions, ...createOfferActions];

    try {
      if (!this.session) {
        throw new Error('Unable to create a sale offer without logging in.');
      }

      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );

      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        error:
          e.message || 'An error has occurred while creating the sale offer.',
      };
    }
  };

  /**
   * Cancel the announcement of an asset sale and its initial offer on atomic market.
   *
   * @param {string}   actor     Chain account of the asset's current owner.
   * @param {string}   sale_id   ID of the sale to cancel.
   * @return {SaleResponse}      Returns an object indicating the success of the transaction and transaction ID.
   */

  cancelSale = async ({
    actor,
    sale_id,
  }: SaleOptions): Promise<SaleResponse> => {
    const actions = [
      {
        account: 'atomicmarket',
        name: 'cancelsale',
        authorization: [
          {
            actor,
            permission: 'active',
          },
        ],
        data: {
          sale_id,
        },
      },
    ];

    try {
      if (!this.session) {
        throw new Error('Unable to cancel a sale without logging in.');
      }

      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );

      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        error: e.message || 'An error has occurred while cancelling the sale.',
      };
    }
  };

  /**
   * Cancel the announcements of several asset sales and their initial offers on atomic market.
   *
   * @param {string}   actor      Chain account of the asset's current owner.
   * @param {string[]} saleIds    Array of IDs for the sales to cancel.
   * @return {SaleResponse}       Returns an object indicating the success of the transaction and transaction ID.
   */

  cancelMultipleSales = async ({
    actor,
    saleIds,
  }: CancelMultipleSalesOptions): Promise<SaleResponse> => {
    const actions = saleIds.map((sale_id) => ({
      account: 'atomicmarket',
      name: 'cancelsale',
      authorization: [
        {
          actor,
          permission: 'active',
        },
      ],
      data: {
        sale_id,
      },
    }));

    try {
      if (!this.session) {
        throw new Error('Unable to cancel a sale without logging in.');
      }

      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );

      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      return {
        success: false,
        error: e.message || 'An error has occurred while cancelling the sale.',
      };
    }
  };

  purchaseSale = async ({
    buyer,
    amount,
    sale_id,
  }: PurchaseSaleOptions): Promise<SaleResponse> => {
    const actions = [
      {
        account: TOKEN_CONTRACT,
        name: 'transfer',
        authorization: [
          {
            actor: buyer,
            permission: 'active',
          },
        ],
        data: {
          from: buyer,
          to: 'atomicmarket',
          quantity: amount,
          memo: 'deposit',
        },
      },
      {
        account: 'atomicmarket',
        name: 'purchasesale',
        authorization: [
          {
            actor: buyer,
            permission: 'active',
          },
        ],
        data: {
          sale_id,
          buyer,
          intended_delphi_median: 0,
          taker_marketplace: 'fees.market',
        },
      },
    ];
    try {
      if (!this.session) {
        throw new Error('Unable to purchase a sale without logging in.');
      }

      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );

      return {
        success: true,
        transactionId: result.processed.id,
      };
    } catch (e) {
      const message = e.message[0].toUpperCase() + e.message.slice(1);
      return {
        success: false,
        error:
          message || 'An error has occurred while trying to purchase an item.',
      };
    }
  };
}

export default new ProtonSDK();

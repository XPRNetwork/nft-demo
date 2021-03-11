import { ConnectWallet } from '@proton/web-sdk';
import { LinkSession, Link } from '@proton/link';
import logoUrl from '../public/logo.svg';

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

interface SaleOptions {
  actor: string;
  sale_id: string;
}

interface SaleResponse {
  success: boolean;
  transactionId?: string;
  error?: number;
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
      const { avatar, isLightKYCVerified, name } = accountData[0];
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
      const { avatar, isLightKYCVerified, name } = accountData[0];
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
   * Announce an asset sale and create an initial offer for the asset on atomic market.
   *
   * @param {string}   seller     Chain account of the asset's current owner.
   * @param {string}   asset_id   ID of the asset to sell.
   * @param {string}   price      Listing price of the sale (i.e. '1.0000').
   * @param {string}   currency   Token precision (number of decimal points) and token symbol that the sale will be paid in (i.e. '4,XPR').
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
          maker_marketplace: '',
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
   * Cancel the announcement of an asset sale and its initial offer on atomic market.
   *
   * @param {string}   actor     Chain account of the asset's current owner.
   * @param {string}   sale_id   ID of the sale to cancel.
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
}

export default new ProtonSDK();

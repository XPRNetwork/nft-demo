import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProtonSDK from '../../services/proton';
import { SaleAsset } from '../../services/sales';
import Button from '../Button';
import { General, Amount, Row, Divider } from '../../styles/details.styled';
import { ErrorMessage, DropdownMenu } from './BuyAssetForm.styled';
import { useAuthContext, useModalContext, MODAL_TYPES } from '../Provider';
import { getFromApi } from '../../utils/browser-fetch';
import { toQueryString, addPrecisionDecimal } from '../../utils';

type Props = {
  templateId: string;
  lowestPrice: string;
  highestPrice: string;
  maxSupply: string;
};

const getAllTemplateSales = async (
  templateId: string
): Promise<SaleAsset[]> => {
  try {
    let sales = [];
    let hasResults = true;
    let page = 1;
    while (hasResults) {
      const queryObject = {
        state: '3',
        sort: 'price',
        order: 'asc',
        template_id: templateId,
        page,
      };
      const queryParams = toQueryString(queryObject);
      const result = await getFromApi<SaleAsset[]>(
        `https://proton.api.atomicassets.io/atomicmarket/v1/sales?${queryParams}`
      );

      if (!result.success) {
        throw new Error((result.message as unknown) as string);
      }

      if (result.data.length === 0) {
        hasResults = false;
      }

      sales = sales.concat(result.data);
      page += 1;
    }

    let saleAssets = [];
    for (const sale of sales) {
      const {
        assets,
        listing_price,
        listing_symbol,
        sale_id,
        price: { token_precision },
      } = sale;

      const formattedAssets = assets.map(({ owner, template_mint }) => ({
        saleId: sale_id,
        templateMint: template_mint,
        owner,
        salePrice: `${addPrecisionDecimal(listing_price, token_precision)}`,
        saleToken: listing_symbol,
        listing_price,
      }));
      saleAssets = saleAssets.concat(formattedAssets);
    }

    return saleAssets as SaleAsset[];
  } catch (e) {
    throw new Error(e);
  }
};

const BuyAssetForm = ({
  templateId,
  lowestPrice,
  highestPrice,
  maxSupply,
}: Props): JSX.Element => {
  const router = useRouter();
  const { openModal } = useModalContext();
  const { currentUser, currentUserBalance, login } = useAuthContext();
  const [sales, setSales] = useState<SaleAsset[]>([]);
  const [purchasingError, setPurchasingError] = useState<string>('');
  const [saleId, setSaleId] = useState('');
  const balanceAmount = parseFloat(currentUserBalance.split(' ')[0]);
  const lowestAmount = lowestPrice
    ? parseFloat(lowestPrice.split(' ')[0])
    : undefined;
  const isBalanceEmpty = balanceAmount === 0;
  const isBalanceInsufficient = lowestAmount && lowestAmount > balanceAmount;

  useEffect(() => {
    setPurchasingError('');
    if (currentUser && (lowestPrice || highestPrice)) {
      const balanceError =
        isBalanceEmpty || isBalanceInsufficient
          ? `Insufficient funds: this NFT is listed for ${lowestAmount.toFixed(
              6
            )} FOOBAR and your account balance is ${currentUserBalance}. Please deposit more funds to continue this transaction.`
          : '';
      setPurchasingError(balanceError);
    }
  }, [currentUserBalance]);

  useEffect(() => {
    (async () => {
      const saleAssets = await getAllTemplateSales(templateId);
      setSales(saleAssets);
    })();
  }, [templateId]);

  const buyAsset = async () => {
    if (!saleId) {
      setPurchasingError('Must select an asset to buy.');
      return;
    }

    try {
      const purchaseResult = await ProtonSDK.purchaseSale({
        buyer: currentUser ? currentUser.actor : '',
        sale_id: saleId,
      });
      if (purchaseResult.success) {
        router.replace(router.asPath);
      } else {
        throw purchaseResult.error;
      }
    } catch (e) {
      setPurchasingError(e.message);
    }
  };

  const openDepositModal = () => openModal(MODAL_TYPES.DEPOSIT);

  const handleButtonClick = currentUser
    ? isBalanceEmpty || isBalanceInsufficient
      ? openDepositModal
      : buyAsset
    : login;

  const buttonText = currentUser
    ? isBalanceEmpty || isBalanceInsufficient
      ? 'Deposit funds to buy'
      : 'Buy'
    : 'Connect wallet to buy';

  return (
    <section>
      <Row>
        <General>Edition Size</General>
        <General>For Sale</General>
      </Row>
      <Row>
        <p>{maxSupply}</p>
        <p>{sales.length}</p>
      </Row>
      <Divider />
      <General>Lowest Price</General>
      <Amount>{lowestPrice ? lowestPrice : 'None'}</Amount>
      <General>Highest Price</General>
      <Amount>{highestPrice ? highestPrice : 'None'}</Amount>
      <General>Serial number</General>
      <DropdownMenu
        name="Available Assets For Sale"
        value={saleId}
        onChange={(e) => setSaleId(e.target.value)}>
        <option key="blank" value="" disabled>
          - - Select a serial number - -
        </option>
        {sales.length > 0 &&
          sales.map((sale) => (
            <option key={sale.saleId} value={sale.saleId}>
              #{sale.templateMint} - {sale.salePrice} {sale.saleToken}
            </option>
          ))}
      </DropdownMenu>
      <Button fullWidth filled rounded onClick={handleButtonClick}>
        {buttonText}
      </Button>
      {purchasingError ? <ErrorMessage>{purchasingError}</ErrorMessage> : null}
    </section>
  );
};

export default BuyAssetForm;

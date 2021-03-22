import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProtonSDK from '../../services/proton';
import { SaleAsset, getAllTemplateSales } from '../../services/sales';
import Button from '../Button';
import { General, Amount, Row, Divider } from '../../styles/details.styled';
import { ErrorMessage, DropdownMenu } from './BuyAssetForm.styled';
import { useAuthContext, useModalContext, MODAL_TYPES } from '../Provider';
import { formatPrice } from '../../utils';

type Props = {
  templateId: string;
  lowestPrice: string;
  highestPrice: string;
  maxSupply: string;
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
  const lowestAmountString = lowestPrice.split(' ')[0];
  const lowestAmount = lowestPrice ? parseFloat(lowestAmountString) : undefined;
  const isBalanceEmpty = balanceAmount === 0;
  const isBalanceInsufficient = lowestAmount && lowestAmount > balanceAmount;

  useEffect(() => {
    setPurchasingError('');
    if (currentUser && (lowestPrice || highestPrice)) {
      const balanceError =
        isBalanceEmpty || isBalanceInsufficient
          ? `Insufficient funds: this NFT is listed for ${formatPrice(
              lowestPrice
            )} and your account balance is ${currentUserBalance}. Please deposit more funds to continue this transaction.`
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
      <Amount>{lowestPrice ? formatPrice(lowestPrice) : 'None'}</Amount>
      <General>Highest Price</General>
      <Amount>{highestPrice ? formatPrice(highestPrice) : 'None'}</Amount>
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

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProtonSDK from '../../services/proton';
import { SaleAsset } from '../../services/sales';
import Button from '../Button';
import { General, Amount, Row, Divider } from '../../styles/details.styled';
import { Error, DropdownMenu } from './BuyAssetForm.styled';
import { useAuthContext, useModalContext, MODAL_TYPES } from '../Provider';

type Props = {
  lowestPrice: string;
  highestPrice: string;
  maxSupply: string;
  allSalesForTemplate: SaleAsset[];
};

const BuyAssetForm = ({
  lowestPrice,
  highestPrice,
  maxSupply,
  allSalesForTemplate,
}: Props): JSX.Element => {
  const router = useRouter();
  const { openModal } = useModalContext();
  const { currentUser, currentUserBalance } = useAuthContext();
  const [purchasingError, setPurchasingError] = useState('');
  const [saleId, setSaleId] = useState('');
  const balanceAmount = parseFloat(currentUserBalance.split(' ')[0]);
  const lowestAmount = lowestPrice
    ? parseFloat(lowestPrice.split(' ')[0])
    : undefined;
  const isBalanceEmpty = balanceAmount === 0;
  const isBalanceInsufficient = lowestAmount && lowestAmount > balanceAmount;

  useEffect(() => {
    setPurchasingError('');
    if (lowestPrice || highestPrice) {
      const balanceError =
        isBalanceEmpty || isBalanceInsufficient
          ? `Insufficient funds: this NFT is listed for ${lowestAmount.toFixed(
              6
            )} FOOBAR and your account balance is ${currentUserBalance}. Please deposit more funds to continue this transaction.`
          : '';
      setPurchasingError(balanceError);
    }
  }, [currentUserBalance]);

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
        router.reload();
      } else {
        throw purchaseResult.error;
      }
    } catch (e) {
      setPurchasingError(e.message);
    }
  };

  const openDepositModal = () => openModal(MODAL_TYPES.DEPOSIT);

  return (
    <section>
      <Row>
        <General>Edition Size</General>
        <General>For Sale</General>
      </Row>
      <Row>
        <p>{maxSupply}</p>
        <p>{allSalesForTemplate.length}</p>
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
        <option key="blank" value="">
          - - Select a serial number - -
        </option>
        {allSalesForTemplate.length > 0 &&
          allSalesForTemplate.map((sale) => {
            return (
              <option
                key={sale.saleId}
                value={sale.saleId}
                selected={sale.saleId === saleId}>
                #{sale.templateMint} - {sale.salePrice} {sale.saleToken}
              </option>
            );
          })}
      </DropdownMenu>
      <Button
        fullWidth
        filled
        rounded
        onClick={
          isBalanceEmpty || isBalanceInsufficient ? openDepositModal : buyAsset
        }>
        {isBalanceEmpty || isBalanceInsufficient
          ? 'Deposit funds to buy'
          : 'Buy'}
      </Button>
      {purchasingError ? <Error>{purchasingError}</Error> : null}
    </section>
  );
};

export default BuyAssetForm;

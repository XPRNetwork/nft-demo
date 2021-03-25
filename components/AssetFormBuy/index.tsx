import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import Button from '../Button';
import { useAuthContext } from '../Provider';
import {
  ErrorMessage,
  DropdownMenu,
  General,
  Amount,
  Row,
} from './AssetFormBuy.styled';
import { SaleAsset } from '../../services/sales';

type Props = {
  dropdownAssets: SaleAsset[];
  lowestPrice: string;
  maxSupply: string;
  buttonText: string;
  saleId: string;
  purchasingError: string;
  isLoadingPrices: boolean;
  formattedPricesBySaleId: {
    [templateMint: string]: string;
  };
  handleButtonClick: () => void;
  setPurchasingError: Dispatch<SetStateAction<string>>;
  setIsBalanceInsufficient: Dispatch<SetStateAction<boolean>>;
  setSaleId: Dispatch<SetStateAction<string>>;
};

export const AssetFormBuy = ({
  dropdownAssets,
  lowestPrice,
  maxSupply,
  buttonText,
  saleId,
  purchasingError,
  isLoadingPrices,
  formattedPricesBySaleId,
  handleButtonClick,
  setPurchasingError,
  setIsBalanceInsufficient,
  setSaleId,
}: Props): JSX.Element => {
  const { currentUser, currentUserBalance } = useAuthContext();
  const balanceAmount = parseFloat(
    currentUserBalance.split(' ')[0].replace(',', '')
  );

  const handleDropdownSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setPurchasingError('');
    setIsBalanceInsufficient(false);

    if (!currentUser) {
      setPurchasingError('You must log in to purchase an asset.');
      return;
    }

    const id = e.target.value;
    const priceString = formattedPricesBySaleId[id];
    const amount = parseFloat(priceString.split(' ')[0].replace(',', ''));
    if (amount > balanceAmount) {
      setIsBalanceInsufficient(true);
      setPurchasingError(
        `Insufficient funds: this NFT is listed for ${priceString} and your account balance is ${currentUserBalance}. Please visit Foobar Faucet for more funds to continue this transaction.`
      );
    }

    setSaleId(id);
  };

  return (
    <section>
      <Row>
        <General>Lowest Market Price</General>
        <General>Edition Size</General>
      </Row>
      <Row>
        <Amount>{lowestPrice || 'None'}</Amount>
        <Amount>{maxSupply}</Amount>
      </Row>
      <General>Serial number</General>
      <DropdownMenu
        isLoading={isLoadingPrices}
        name="Available Assets For Sale"
        value={saleId}
        onChange={handleDropdownSelect}>
        <option key="blank" value="" disabled>
          - - Select a serial number - -
        </option>
        {dropdownAssets.length > 0 &&
          dropdownAssets.map(({ saleId, templateMint, salePrice }) => (
            <option key={templateMint} value={saleId}>
              #{templateMint} - {salePrice}
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

export default AssetFormBuy;

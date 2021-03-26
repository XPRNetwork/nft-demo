import { Dispatch, SetStateAction, useEffect } from 'react';
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
  setAssetId: Dispatch<SetStateAction<string>>;
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
  setAssetId,
}: Props): JSX.Element => {
  const { currentUser, currentUserBalance } = useAuthContext();

  useEffect(() => {
    dropdownAssets.forEach((asset) => {
      if (asset.salePrice === lowestPrice) {
        handleDropdownSelect(asset.saleId);
      }
    });
  }, [dropdownAssets, lowestPrice]);

  const balanceAmount = parseFloat(
    currentUserBalance.split(' ')[0].replace(/[,]/g, '')
  );

  const handleDropdownSelect = (id: string) => {
    const priceString = formattedPricesBySaleId[id];
    const amount = parseFloat(priceString.split(' ')[0].replace(/[,]/g, ''));
    setPurchasingError('');
    setIsBalanceInsufficient(false);
    setSaleId(id);
    setAssetId(dropdownAssets.find((asset) => asset.saleId === id).assetId);

    if (!currentUser) {
      setPurchasingError('You must log in to purchase an asset.');
    }

    if (amount > balanceAmount) {
      setIsBalanceInsufficient(true);
      setPurchasingError(
        `Insufficient funds: this NFT is listed for ${priceString} and your account balance is ${currentUserBalance}. Please visit Foobar Faucet for more funds to continue this transaction.`
      );
    }
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
        onChange={(e) => handleDropdownSelect(e.target.value)}>
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

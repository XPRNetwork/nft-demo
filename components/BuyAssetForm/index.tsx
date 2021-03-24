import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import ProtonSDK from '../../services/proton';
import { SaleAsset, getAllTemplateSales } from '../../services/sales';
import Button from '../Button';
import { General, Amount, Row, Divider } from '../../styles/details.styled';
import { ErrorMessage, DropdownMenu } from './BuyAssetForm.styled';
import { useAuthContext } from '../Provider';
import * as gtag from '../../utils/gtag';

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
  const { currentUser, currentUserBalance, login } = useAuthContext();
  const [sales, setSales] = useState<SaleAsset[]>([]);
  const [formattedPricesBySaleId, setFormattedPricesBySaleId] = useState<{
    [templateMint: string]: string;
  }>({});
  const [rawPricesBySaleId, setRawPricesBySaleId] = useState<{
    [templateMint: string]: string;
  }>({});
  const [purchasingError, setPurchasingError] = useState<string>('');
  const [isBalanceInsufficient, setIsBalanceInsufficient] = useState<boolean>(
    false
  );
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);
  const [saleId, setSaleId] = useState('');
  const balanceAmount = parseFloat(
    currentUserBalance.split(' ')[0].replace(',', '')
  );
  const [rawPriceOfSale, setRawPriceOfSale] = useState('');

  useEffect(() => {
    setPurchasingError('');
    if (balanceAmount === 0) setIsBalanceInsufficient(true);
  }, [currentUser, currentUserBalance]);

  useEffect(() => {
    (async () => {
      setIsLoadingPrices(true);
      const { formattedPrices, rawPrices, assets } = await getAllTemplateSales(
        templateId
      );

      assets.forEach((asset) => {
        if (asset.salePrice === lowestPrice) {
          setSaleId(asset.saleId);
        }
      });
      setSales(assets);
      setFormattedPricesBySaleId(formattedPrices);
      setRawPricesBySaleId(rawPrices);
      setIsLoadingPrices(false);
    })();
  }, [templateId]);

  const buyAsset = async () => {
    if (!saleId) {
      setPurchasingError('Must select an asset to buy.');
      return;
    }

    try {
      if (!currentUser) {
        setPurchasingError('Must be logged in');
        return;
      }

      const chainAccount = currentUser.actor;
      const purchaseResult = await ProtonSDK.purchaseSale({
        buyer: chainAccount,
        amount: rawPriceOfSale,
        sale_id: saleId,
      });

      if (purchaseResult.success) {
        gtag.event({ action: 'buy_nft' });
        setTimeout(() => {
          router.push(`/my-nfts/${chainAccount}`);
        }, 1000);
      } else {
        throw purchaseResult.error;
      }
    } catch (e) {
      setPurchasingError(e.message);
    }
  };

  const handleButtonClick = currentUser
    ? isBalanceInsufficient
      ? () => window.open('https://foobar.protonchain.com/')
      : buyAsset
    : login;

  const buttonText = currentUser
    ? isBalanceInsufficient
      ? 'Visit Foobar Faucet'
      : 'Buy'
    : 'Connect wallet to buy';

  const handleDropdownSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setPurchasingError('');

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

    setRawPriceOfSale(rawPricesBySaleId[id]);
    setSaleId(id);
  };

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
        isLoading={isLoadingPrices}
        name="Available Assets For Sale"
        value={saleId}
        onChange={handleDropdownSelect}>
        <option key="blank" value="" disabled>
          - - Select a serial number - -
        </option>
        {sales.length > 0 &&
          sales.map(({ saleId, templateMint, salePrice }) => (
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

export default BuyAssetForm;

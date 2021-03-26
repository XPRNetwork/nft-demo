import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DetailsLayout from '../components/DetailsLayout';
import ErrorComponent from '../components/Error';
import PageLayout from '../components/PageLayout';
import AssetFormBuy from '../components/AssetFormBuy';
import LoadingPage from '../components/LoadingPage';
import { useAuthContext } from '../components/Provider';
import { getTemplateDetails, Template } from '../services/templates';
import {
  getAllTemplateSales,
  getSalesHistoryForTemplate,
  Sale,
  SaleAsset,
} from '../services/sales';
import ProtonSDK from '../services/proton';
import { DEFAULT_COLLECTION } from '../utils/constants';
import * as gtag from '../utils/gtag';

const emptyTemplateDetails = {
  lowestPrice: '',
  highestPrice: '',
  max_supply: '',
  immutable_data: {
    image: '',
    name: '',
    series: 0,
  },
};

type Query = {
  [query: string]: string;
};

const MarketplaceTemplateDetail = (): JSX.Element => {
  const router = useRouter();
  const { templateId } = router.query as Query;
  const {
    updateCurrentUserBalance,
    currentUser,
    currentUserBalance,
    login,
  } = useAuthContext();

  const [sales, setSales] = useState<Sale[]>([]);
  const [templateAssets, setTemplateAssets] = useState<SaleAsset[]>([]);
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
  const [template, setTemplate] = useState<Template>(emptyTemplateDetails);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [saleId, setSaleId] = useState('');

  const balanceAmount = parseFloat(
    currentUserBalance.split(' ')[0].replace(',', '')
  );
  const {
    lowestPrice,
    max_supply,
    immutable_data: { image, name },
  } = template;

  useEffect(() => {
    if (templateId) {
      try {
        (async () => {
          setIsLoadingPrices(true);
          const templateDetails = await getTemplateDetails(
            DEFAULT_COLLECTION,
            templateId
          );
          const sales = await getSalesHistoryForTemplate(templateId);
          const {
            formattedPrices,
            rawPrices,
            assets,
          } = await getAllTemplateSales(templateId);

          setTemplateAssets(assets);
          setFormattedPricesBySaleId(formattedPrices);
          setRawPricesBySaleId(rawPrices);
          setIsLoadingPrices(false);
          setTemplate(templateDetails);
          setSales(sales);
          setIsLoading(false);
        })();
      } catch (e) {
        setError(e.message);
      }
    }
  }, [templateId]);

  useEffect(() => {
    setPurchasingError('');
    if (balanceAmount === 0) setIsBalanceInsufficient(true);
  }, [currentUser, currentUserBalance]);

  useEffect(() => {
    templateAssets.forEach((asset) => {
      if (asset.salePrice === lowestPrice) {
        setSaleId(asset.saleId);
      }
    });
  }, [templateAssets]);

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
        amount: rawPricesBySaleId[saleId],
        sale_id: saleId,
      });

      if (purchaseResult.success) {
        gtag.event({ action: 'buy_nft' });
        updateCurrentUserBalance(chainAccount);
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

  const getContent = () => {
    if (error) {
      return (
        <ErrorComponent
          errorMessage={error}
          buttonText="Try again"
          buttonOnClick={() => router.reload()}
        />
      );
    }

    if (isLoading) {
      return <LoadingPage />;
    }

    return (
      <DetailsLayout
        name={name}
        sales={sales}
        error={error}
        image={image as string}>
        <AssetFormBuy
          dropdownAssets={templateAssets}
          lowestPrice={lowestPrice}
          maxSupply={max_supply}
          buttonText={buttonText}
          saleId={saleId}
          purchasingError={purchasingError}
          isLoadingPrices={isLoadingPrices}
          formattedPricesBySaleId={formattedPricesBySaleId}
          handleButtonClick={handleButtonClick}
          setPurchasingError={setPurchasingError}
          setIsBalanceInsufficient={setIsBalanceInsufficient}
          setSaleId={setSaleId}
        />
      </DetailsLayout>
    );
  };

  return <PageLayout title={`${name} Details`}>{getContent()}</PageLayout>;
};

export default MarketplaceTemplateDetail;

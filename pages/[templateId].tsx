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
  getSalesHistoryForAsset,
  Sale,
  SaleAsset,
} from '../services/sales';
import ProtonSDK from '../services/proton';
import { DEFAULT_COLLECTION } from '../utils/constants';
import * as gtag from '../utils/gtag';

const emptyTemplateDetails = {
  lowestPrice: '',
  max_supply: '',
  collection: {
    author: '',
    collection_name: '',
  },
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
  const [template, setTemplate] = useState<Template>(emptyTemplateDetails);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [saleId, setSaleId] = useState('');
  const [currentAsset, setCurrentAsset] = useState<Partial<SaleAsset>>({});

  const balanceAmount = parseFloat(
    currentUserBalance.split(' ')[0].replace(/[,]/g, '')
  );
  const {
    lowestPrice,
    max_supply,
    collection: { author, collection_name },
    immutable_data: { image, name },
  } = template;

  useEffect(() => {
    if (templateId) {
      try {
        (async () => {
          setIsLoading(true);
          const templateDetails = await getTemplateDetails(
            DEFAULT_COLLECTION,
            templateId
          );
          const {
            formattedPrices,
            rawPrices,
            assets,
          } = await getAllTemplateSales(templateId);

          setTemplateAssets(assets);
          setFormattedPricesBySaleId(formattedPrices);
          setRawPricesBySaleId(rawPrices);
          setIsLoading(false);
          setTemplate(templateDetails);
          setIsLoading(false);
        })();
      } catch (e) {
        setError(e.message);
      }
    }
  }, [templateId]);

  useEffect(() => {
    try {
      (async () => {
        const sales = await getSalesHistoryForAsset(currentAsset.assetId);
        setSales(sales);
      })();
    } catch (e) {
      setError(e.message);
    }
  }, [currentAsset]);

  useEffect(() => {
    setPurchasingError('');
    if (balanceAmount === 0) setIsBalanceInsufficient(true);
  }, [currentUser, currentUserBalance]);

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
        templateId={templateId}
        templateName={name}
        collectionName={collection_name}
        collectionAuthor={author}
        sales={sales}
        error={error}
        image={image}
        currentAsset={currentAsset}>
        <AssetFormBuy
          dropdownAssets={templateAssets}
          lowestPrice={lowestPrice}
          maxSupply={max_supply}
          buttonText={buttonText}
          saleId={saleId}
          purchasingError={purchasingError}
          formattedPricesBySaleId={formattedPricesBySaleId}
          handleButtonClick={handleButtonClick}
          setPurchasingError={setPurchasingError}
          setIsBalanceInsufficient={setIsBalanceInsufficient}
          setSaleId={setSaleId}
          setCurrentAsset={setCurrentAsset}
        />
      </DetailsLayout>
    );
  };

  return <PageLayout title={`${name} Details`}>{getContent()}</PageLayout>;
};

export default MarketplaceTemplateDetail;

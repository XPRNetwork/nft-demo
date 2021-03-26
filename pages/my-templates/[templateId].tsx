import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DetailsLayout from '../../components/DetailsLayout';
import ErrorComponent from '../../components/Error';
import PageLayout from '../../components/PageLayout';
import AssetFormSell from '../../components/AssetFormSell';
import LoadingPage from '../../components/LoadingPage';
import {
  useAuthContext,
  useModalContext,
  MODAL_TYPES,
} from '../../components/Provider';
import { getTemplateDetails, Template } from '../../services/templates';
import {
  getUserTemplateAssets,
  Asset,
  RawPrices,
  SaleIds,
} from '../../services/assets';
import { getSalesHistoryForTemplate, Sale } from '../../services/sales';
import { DEFAULT_COLLECTION } from '../../utils/constants';

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

const MyNFTsTemplateDetail = (): JSX.Element => {
  const router = useRouter();
  const { templateId } = router.query as Query;
  const { currentUser } = useAuthContext();
  const { openModal, setModalProps } = useModalContext();
  const [sales, setSales] = useState<Sale[]>([]);
  const [templateAssets, setTemplateAssets] = useState<Asset[]>([]);
  const [rawPricesByAssetId, setRawPricesByAssetId] = useState<RawPrices>({});
  const [saleIdsByAssetId, setSaleIdsByAssetId] = useState<SaleIds>({});
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);
  const [template, setTemplate] = useState<Template>(emptyTemplateDetails);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [assetId, setAssetId] = useState('');

  const isSelectedAssetBeingSold =
    rawPricesByAssetId[assetId] && rawPricesByAssetId[assetId].rawPrice;
  const {
    lowestPrice,
    max_supply,
    collection: { author, collection_name },
    immutable_data: { image, name },
  } = template;

  const fetchPageData = async () => {
    try {
      const owner = currentUser ? currentUser.actor : '';
      setIsLoadingPrices(true);

      const templateDetails = await getTemplateDetails(
        DEFAULT_COLLECTION,
        templateId
      );
      const sales = await getSalesHistoryForTemplate(templateId);
      const { assets, rawPrices, saleIds } = await getUserTemplateAssets(
        owner,
        templateId
      );

      const assetIds = assets
        .filter(({ asset_id }) => !saleIds[asset_id])
        .map(({ asset_id }) => asset_id);

      setModalProps({
        saleIds: Object.values(saleIds),
        assetIds,
        fetchPageData,
      });

      setSaleIdsByAssetId(saleIds);
      setTemplateAssets(assets);
      setAssetId(assets[0].asset_id);
      setRawPricesByAssetId(rawPrices);
      setIsLoadingPrices(false);
      setTemplate(templateDetails);
      setSales(sales);
      setIsLoading(false);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (templateId) {
      fetchPageData();
    }
  }, [templateId]);

  const createSale = () => {
    openModal(MODAL_TYPES.CREATE_SALE);
    setModalProps({
      assetId,
      fetchPageData,
    });
  };

  const cancelSale = () => {
    openModal(MODAL_TYPES.CANCEL_SALE);
    setModalProps({
      saleId: saleIdsByAssetId[assetId],
      fetchPageData,
    });
  };

  const handleButtonClick = isSelectedAssetBeingSold ? cancelSale : createSale;

  const buttonText = isSelectedAssetBeingSold ? 'Cancel Sale' : 'Mark for sale';

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
        image={image}>
        <AssetFormSell
          dropdownAssets={templateAssets}
          lowestPrice={lowestPrice}
          maxSupply={max_supply}
          buttonText={buttonText}
          assetId={assetId}
          isLoadingPrices={isLoadingPrices}
          handleButtonClick={handleButtonClick}
          setAssetId={setAssetId}
        />
      </DetailsLayout>
    );
  };

  return <PageLayout title={`${name} Details`}>{getContent()}</PageLayout>;
};

export default MyNFTsTemplateDetail;

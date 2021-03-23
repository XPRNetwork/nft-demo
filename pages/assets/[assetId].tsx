import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DetailsLayout from '../../components/DetailsLayout';
import ErrorComponent from '../../components/Error';
import Button from '../../components/Button';
import AssetSaleDetails from '../../components/AssetSaleDetails';
import AssetSaleForm from '../../components/AssetSaleForm';
import { useAuthContext } from '../../components/Provider';
import PageLayout from '../../components/PageLayout';
import LoadingPage from '../../components/LoadingPage';

import { getSalesHistoryForAsset, Sale } from '../../services/sales';
import { getAssetDetails, Asset } from '../../services/assets';

type Query = {
  [query: string]: string;
};

const emptyAsset = {
  name: '',
  owner: '',
  asset_id: '',
  isForSale: false,
  salePrice: '',
  saleId: '',
  data: {
    image: '',
    series: '',
  },
  template: {
    template_id: '',
    max_supply: '',
  },
};

const CollectionAssetDetail = (): JSX.Element => {
  const router = useRouter();
  const { assetId } = router.query as Query;
  const { login, currentUser } = useAuthContext();
  const [error, setError] = useState<string>('');
  const [shouldReload, setShouldReload] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [asset, setAsset] = useState<Asset>(emptyAsset);
  const [sales, setSales] = useState<Sale[]>([]);

  const {
    name,
    owner,
    asset_id,
    isForSale,
    salePrice,
    saleId,
    template_mint,
    data: { image, series },
    template: { template_id, max_supply },
  } = asset;

  useEffect(() => {
    if (assetId && shouldReload) {
      (async () => {
        try {
          const asset = await getAssetDetails(assetId);
          const sales = await getSalesHistoryForAsset(assetId);

          setAsset(asset);
          setSales(sales);
          setIsLoading(false);
          setShouldReload(false);
        } catch (e) {
          setError(e.message);
          setShouldReload(false);
        }
      })();
    }
  }, [assetId, shouldReload]);

  const getContent = () => {
    if (!currentUser) {
      return (
        <ErrorComponent
          errorMessage="You must log in to view your collection."
          buttonText="Connect Wallet"
          buttonOnClick={login}
        />
      );
    }

    if (isLoading) {
      return <LoadingPage />;
    }

    const isOwner = owner === currentUser.actor;

    if (error || !asset) {
      return (
        <ErrorComponent
          errorMessage={error || 'Asset details not found'}
          buttonText="Try again"
          buttonOnClick={() => router.reload()}
        />
      );
    }

    return (
      <DetailsLayout
        name={asset.name}
        seriesNumber={series as string}
        sales={sales}
        error={error}
        image={image as string}
        serial_number={template_mint}
        max_supply={max_supply}
        id={asset_id}
        type="Asset">
        {isForSale ? (
          <AssetSaleDetails
            saleId={saleId}
            salePrice={salePrice}
            isOwner={isOwner}
            template_id={template_id}
            setShouldReload={setShouldReload}
          />
        ) : isOwner ? (
          <AssetSaleForm
            asset_id={asset_id}
            setShouldReload={setShouldReload}
          />
        ) : (
          <Button onClick={() => router.push(`/${template_id}`)}>
            View Listing
          </Button>
        )}
      </DetailsLayout>
    );
  };

  return <PageLayout title={`${name} Details`}>{getContent()}</PageLayout>;
};

export default CollectionAssetDetail;

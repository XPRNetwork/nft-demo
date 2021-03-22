import { useState } from 'react';
import { useRouter } from 'next/router';
import DetailsLayout from '../../components/DetailsLayout';
import ErrorComponent from '../../components/Error';
import Button from '../../components/Button';
import { getSalesHistoryForAsset, Sale } from '../../services/sales';
import { Asset, getAssetDetails } from '../../services/assets';
import AssetSaleDetails from '../../components/AssetSaleDetails';
import AssetSaleForm from '../../components/AssetSaleForm';
import { useAuthContext } from '../../components/Provider';
import PageLayout from '../../components/PageLayout';
import { formatPrice } from '../../utils';

type Props = {
  asset: Asset;
  error: string;
  sales: Sale[];
};

const CollectionAssetDetail = ({ asset, sales, error }: Props): JSX.Element => {
  const router = useRouter();
  const { login, currentUser } = useAuthContext();
  const [detailsError, setDetailsError] = useState<string>(error);
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

    const isOwner = owner === currentUser.actor;

    if (detailsError || !asset) {
      return (
        <ErrorComponent
          errorMessage={detailsError || 'Asset details not found'}
          buttonText="Try again"
          buttonOnClick={() => router.reload()}
        />
      );
    }

    return (
      <DetailsLayout
        name={name}
        seriesNumber={series as string}
        sales={sales}
        error={error}
        image={image as string}
        serial_number={template_mint}
        max_supply={max_supply}>
        {isForSale ? (
          <AssetSaleDetails
            saleId={saleId}
            salePrice={formatPrice(salePrice)}
            isOwner={isOwner}
            template_id={template_id}
          />
        ) : isOwner ? (
          <AssetSaleForm asset_id={asset_id} />
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

type GetServerSidePropsContext = {
  params: {
    assetId: string;
  };
};

export const getServerSideProps = async ({
  params: { assetId },
}: GetServerSidePropsContext): Promise<{ props: Props }> => {
  try {
    const result = await getAssetDetails(assetId);
    let sales = await getSalesHistoryForAsset(assetId);
    sales = sales.map((sale) => ({
      ...sale,
      asset_serial: result.template_mint,
    }));
    return {
      props: {
        asset: result,
        sales: sales,
        error: '',
      },
    };
  } catch (e) {
    return {
      props: {
        asset: {
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
        },
        sales: [],
        error: e.message,
      },
    };
  }
};

export default CollectionAssetDetail;

import { useState } from 'react';
import { useRouter } from 'next/router';
import DetailsLayout from '../../components/DetailsLayout';
import ErrorComponent from '../../components/Error';
import Button from '../../components/Button';
import { Asset, getAssetDetails } from '../../services/assets';
import AssetSaleDetails from '../../components/AssetSaleDetails';
import AssetSaleForm from '../../components/AssetSaleForm';
import { useAuthContext } from '../../components/Provider';
import { Serial, Divider } from '../../styles/details.styled';
import PageLayout from '../../components/PageLayout';

type Props = {
  asset: Asset;
  error: string;
};

const CollectionAssetDetail = ({ asset, error }: Props): JSX.Element => {
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
        details={'Test Details'}
        image={image as string}>
        <Serial>
          Serial number #{template_id}/{max_supply}
        </Serial>
        <Divider />
        {isForSale ? (
          <AssetSaleDetails
            saleId={saleId}
            salePrice={salePrice}
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
    return {
      props: {
        asset: result,
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
        error: e.message,
      },
    };
  }
};

export default CollectionAssetDetail;

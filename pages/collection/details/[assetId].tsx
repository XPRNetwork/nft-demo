import React, { useState } from 'react';
import DetailsLayout from '../../../components/DetailsLayout';
import { Asset, getAssetDetails } from '../../../services/assets';

type Props = {
  asset: Asset;
  error: string;
};

const CollectionAssetDetail = ({ asset, error }: Props): JSX.Element => {
  const [detailsError, setDetailsError] = useState<string>(error);
  const {
    name,
    data: { image, series },
  } = asset;

  const getContent = () => {
    // TODO: readd ForSaleDetails and MoreForSaleDetails
    if (!asset) return;
    if (asset.isForSale) {
      return <div></div>;
      // return <ForSaleDetails asset={currentAsset} />;
    } else {
      return <div></div>;
      // return <MoreForSaleDetails asset={currentAsset} />;
    }
  };

  return (
    <DetailsLayout
      name={name}
      seriesNumber={series as string}
      details={'Test Details'}
      image={image as string}>
      {getContent()}
      {detailsError}
    </DetailsLayout>
  );
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
          data: {
            image: '',
            series: '',
          },
        },
        error: e.message,
      },
    };
  }
};

export default CollectionAssetDetail;

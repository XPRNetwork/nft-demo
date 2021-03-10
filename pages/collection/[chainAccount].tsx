import { useState, useEffect } from 'react';
import PageLayout from '../../components/PageLayout';
import Grid, { GRID_TYPE } from '../../components/Grid';
import { getUserAssets, Asset } from '../../services/assets';
import { Title } from '../../styles/Title.styled';
import { useAuthContext } from '../../components/Provider';
import { getSalesHistoryForTemplate } from '../../services/sales';

type Props = {
  assets: Asset[];
  error: string;
  chainAccount: string;
};

const Collection = ({ assets, error, chainAccount }: Props): JSX.Element => {
  const [collectionError, setCollectionError] = useState(error);
  const { currentUser } = useAuthContext();
  const isTest = ['testuser1111', 'monsters'].includes(chainAccount); // TODO: Remove when Proton NFTs are live
  const hasAccess =
    isTest || (currentUser && chainAccount === currentUser.actor);

  useEffect(() => {
    if (!hasAccess)
      setCollectionError(
        'Unauthorized: you may only view your own collection.'
      );
  }, []);

  return (
    <PageLayout title="Collection">
      <Title>Collection</Title>
      {hasAccess && <Grid items={assets} type={GRID_TYPE.ASSET} />}
      {collectionError}
    </PageLayout>
  );
};

type GetServerSidePropsArgs = {
  params: {
    chainAccount: string;
  };
};

export const getServerSideProps = async ({
  params: { chainAccount },
}: GetServerSidePropsArgs): Promise<{ props: Props }> => {
  try {
    const assets = await getUserAssets(chainAccount);
    return {
      props: {
        assets,
        error: '',
        chainAccount,
      },
    };
  } catch (e) {
    return {
      props: {
        assets: [],
        error: e.message,
        chainAccount,
      },
    };
  }
};

export default Collection;

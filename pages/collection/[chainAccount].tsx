import { useState } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../../components/PageLayout';
import ErrorComponent from '../../components/Error';
import Grid, { GRID_TYPE } from '../../components/Grid';
import { getUserAssets, Asset } from '../../services/assets';
import { Title } from '../../styles/Title.styled';
import { useAuthContext } from '../../components/Provider';

type Props = {
  assets: Asset[];
  error: string;
  chainAccount: string;
};

const Collection = ({ assets, error, chainAccount }: Props): JSX.Element => {
  const router = useRouter();
  const { currentUser, login, authError } = useAuthContext();
  const isTest = ['testuser1111', 'monsters'].includes(chainAccount); // TODO: Remove when Proton NFTs are live

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

    if (authError) {
      return (
        <ErrorComponent
          errorMessage={authError}
          buttonText="Connect Wallet"
          buttonOnClick={login}
        />
      );
    }

    if (!isTest && chainAccount !== currentUser.actor) {
      router.push(`/collection/${currentUser.actor}`);
      return;
    }

    if (!assets.length) {
      return (
        <ErrorComponent errorMessage="Looks like you don't own any monsters yet." />
      );
    }

    if (error) {
      return (
        <ErrorComponent
          errorMessage={error}
          buttonText="Try again"
          buttonOnClick={() => router.reload()}
        />
      );
    }
    return <Grid items={assets} type={GRID_TYPE.ASSET} />;
  };

  return (
    <PageLayout title="Collection">
      <Title>Collection</Title>
      {getContent()}
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

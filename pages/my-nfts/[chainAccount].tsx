import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../../components/PageLayout';
import PaginationButton from '../../components/PaginationButton';
import ErrorComponent from '../../components/Error';
import Grid, { GRID_TYPE } from '../../components/Grid';
import { useAuthContext } from '../../components/Provider';
import { Asset } from '../../services/assets';
import { Title } from '../../styles/Title.styled';
import { getUserAssets } from '../../services/assets';
import LoadingPage from '../../components/LoadingPage';
import Banner from '../../components/Banner';

type Props = {
  chainAccount: string;
};

type GetMyAssetsOptions = {
  chainAccount: string;
  page?: number;
};

const getMyAssets = async ({
  chainAccount,
  page,
}: GetMyAssetsOptions): Promise<Asset[]> => {
  try {
    const pageParam = page ? page : 1;
    const result = await getUserAssets(chainAccount, pageParam);

    return result;
  } catch (e) {
    throw new Error(e);
  }
};

const Collection = ({ chainAccount }: Props): JSX.Element => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const [renderedAssets, setRenderedAssets] = useState<Asset[]>([]);
  const [prefetchedAssets, setPrefetchedAssets] = useState<Asset[]>([]);
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentProfile, setCurrentProfile] = useState<string>('');

  const prefetchNextPage = async () => {
    const prefetchedResult = await getMyAssets({
      chainAccount,
      page: prefetchPageNumber,
    });
    setPrefetchedAssets(prefetchedResult as Asset[]);

    if (!prefetchedResult.length) {
      setPrefetchPageNumber(-1);
    } else {
      setPrefetchPageNumber(prefetchPageNumber + 1);
    }

    setIsLoadingNextPage(false);
  };

  const showNextPage = async () => {
    const allFetchedAssets = renderedAssets.concat(prefetchedAssets);
    setRenderedAssets(allFetchedAssets);
    setIsLoadingNextPage(true);
    await prefetchNextPage();
  };

  useEffect(() => {
    (async () => {
      try {
        router.prefetch('/');
        const assets = await getMyAssets({ chainAccount, page: 1 });
        setRenderedAssets(assets);
        setIsLoading(false);
        await prefetchNextPage();
      } catch (e) {
        setErrorMessage(e.message);
      }
    })();
  }, [chainAccount]);

  useEffect(() => {
    if (currentUser) {
      if (chainAccount !== currentUser.actor) {
        setCurrentProfile(
          `${chainAccount.charAt(0).toUpperCase()}${chainAccount.slice(1)}`
        );
      } else {
        setCurrentProfile('');
      }
    } else if (chainAccount) {
      setCurrentProfile(
        `${chainAccount.charAt(0).toUpperCase()}${chainAccount.slice(1)}`
      );
    }
  }, [currentUser, chainAccount]);

  const getContent = () => {
    if (isLoading) {
      return <LoadingPage />;
    }

    if (!renderedAssets.length) {
      return (
        <ErrorComponent
          errorMessage={`Looks like ${
            currentProfile ? `${currentProfile} doesn't` : `you don't`
          } own any monsters yet.`}
        />
      );
    }

    if (errorMessage) {
      return (
        <ErrorComponent
          errorMessage={errorMessage}
          buttonText="Try again"
          buttonOnClick={() => router.reload()}
        />
      );
    }

    return (
      <>
        <Grid items={renderedAssets} type={GRID_TYPE.ASSET} />
        <PaginationButton
          onClick={showNextPage}
          isLoading={isLoadingNextPage}
          disabled={prefetchPageNumber === -1}
        />
      </>
    );
  };

  return (
    <>
      <PageLayout title="My NFTs">
        <Banner />
        <Title>{currentProfile ? currentProfile : 'My'} NFTs</Title>
        {getContent()}
      </PageLayout>
    </>
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
  return {
    props: {
      chainAccount,
    },
  };
};

export default Collection;

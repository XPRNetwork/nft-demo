import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../../components/PageLayout';
import PaginationButton from '../../components/PaginationButton';
import ErrorComponent from '../../components/Error';
import Grid from '../../components/Grid';
import { useAuthContext } from '../../components/Provider';
import { getTemplatesWithUserAssetCount } from '../../services/templates';
import { Template } from '../../services/templates';
import { Title } from '../../styles/Title.styled';
import LoadingPage from '../../components/LoadingPage';
import Banner from '../../components/Banner';

type Props = {
  chainAccount: string;
};

type GetMyTemplatesOptions = {
  chainAccount: string;
  page?: number;
};

const getMyTemplates = async ({
  chainAccount,
  page,
}: GetMyTemplatesOptions): Promise<Template[]> => {
  try {
    const pageParam = page ? page : 1;
    const result = await getTemplatesWithUserAssetCount(
      chainAccount,
      pageParam
    );
    return result;
  } catch (e) {
    throw new Error(e);
  }
};

const Collection = ({ chainAccount }: Props): JSX.Element => {
  const router = useRouter();
  const { currentUser, login, authError } = useAuthContext();
  const [renderedTemplates, setRenderedTemplates] = useState<Template[]>([]);
  const [prefetchedTemplates, setPrefetchedTemplates] = useState<Template[]>(
    []
  );
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const prefetchNextPage = async () => {
    const prefetchedResult = await getMyTemplates({
      chainAccount,
      page: prefetchPageNumber,
    });
    setPrefetchedTemplates(prefetchedResult);

    if (!prefetchedResult.length) {
      setPrefetchPageNumber(-1);
    } else {
      setPrefetchPageNumber(prefetchPageNumber + 1);
    }

    setIsLoadingNextPage(false);
  };

  const showNextPage = async () => {
    const allFetchedTemplates = renderedTemplates.concat(prefetchedTemplates);
    setRenderedTemplates(allFetchedTemplates);
    setIsLoadingNextPage(true);
    await prefetchNextPage();
  };

  useEffect(() => {
    (async () => {
      try {
        router.prefetch('/');
        const templates = await getMyTemplates({ chainAccount });
        setRenderedTemplates(templates);
        setIsLoading(false);
        await prefetchNextPage();
      } catch (e) {
        setErrorMessage(e.message);
      }
    })();
  }, []);

  const connectWallet = () => {
    login();
    router.replace(router.asPath);
  };

  const getContent = () => {
    if (isLoading) {
      return <LoadingPage />;
    }

    if (!currentUser) {
      return (
        <ErrorComponent
          errorMessage="You must log in to view your collection."
          buttonText="Connect Wallet"
          buttonOnClick={connectWallet}
        />
      );
    }

    if (authError) {
      return (
        <ErrorComponent
          errorMessage={authError}
          buttonText="Connect Wallet"
          buttonOnClick={connectWallet}
        />
      );
    }

    if (chainAccount !== currentUser.actor) {
      router.push(`/my-nfts/${currentUser.actor}`);
      return;
    }

    if (!renderedTemplates.length) {
      return (
        <ErrorComponent errorMessage="Looks like you don't own any monsters yet." />
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
        <Grid items={renderedTemplates} isUsersTemplates={true} />
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
        <Title>Collection</Title>
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

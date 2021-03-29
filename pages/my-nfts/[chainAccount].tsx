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
import { capitalize } from '../../utils';
import { PAGINATION_LIMIT } from '../../utils/constants';

type RouterQuery = {
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

const Collection = (): JSX.Element => {
  const router = useRouter();
  const { chainAccount } = router.query as RouterQuery;
  const { currentUser } = useAuthContext();
  const [renderedTemplates, setRenderedTemplates] = useState<Template[]>([]);
  const [prefetchedTemplates, setPrefetchedTemplates] = useState<Template[]>(
    []
  );
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentProfile, setCurrentProfile] = useState<string>('');

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
  }, [chainAccount]);

  useEffect(() => {
    if (!currentUser || chainAccount !== currentUser.actor) {
      setCurrentProfile(capitalize(chainAccount));
    } else {
      setCurrentProfile('');
    }
  }, [currentUser, chainAccount]);

  const getContent = () => {
    if (isLoading) {
      return <LoadingPage />;
    }

    if (!renderedTemplates.length) {
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
        <Grid
          items={renderedTemplates}
          isUsersTemplates={currentProfile.length === 0}
        />
        <PaginationButton
          onClick={showNextPage}
          isHidden={renderedTemplates.length < PAGINATION_LIMIT}
          isLoading={isLoadingNextPage}
          disabled={prefetchPageNumber === -1}
        />
      </>
    );
  };

  return (
    <>
      <PageLayout title="My NFTs">
        <Title>{currentProfile ? `${currentProfile}'s` : 'My'} NFTs</Title>
        {getContent()}
      </PageLayout>
    </>
  );
};

export default Collection;

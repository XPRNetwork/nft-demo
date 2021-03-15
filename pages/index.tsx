import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import Grid, { GRID_TYPE } from '../components/Grid';
import PaginationButton from '../components/PaginationButton';
import ErrorComponent from '../components/Error';
import { useAuthContext } from '../components/Provider';
import { Title } from '../styles/Title.styled';
import { getFromApi, BrowserResponse } from '../utils/browser-fetch';
import { templatesApiService, Template } from '../services/templates';

type Props = {
  templates: Template[];
  error: string;
  defaultCollectionType: string;
};

type GetCollectionOptions = {
  type: string;
  page?: number;
};

// Keeping function so that we can eventually use to search for other collection types
const getCollection = async ({
  type,
  page,
}: GetCollectionOptions): Promise<BrowserResponse<Template[]>> => {
  try {
    const pageParam = page ? page : 1;
    const result = await getFromApi<Template[]>(
      `/api/get-templates-by-collection?collection=${type}&page=${pageParam}`
    );

    if (!result.success) {
      throw new Error((result.message as unknown) as string);
    }

    return result;
  } catch (e) {
    throw new Error(e);
  }
};

const MarketPlace = ({
  templates,
  error,
  defaultCollectionType,
}: Props): JSX.Element => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [renderedTemplates, setRenderedTemplates] = useState<Template[]>(
    templates
  );
  const [prefetchedTemplates, setPrefetchedTemplates] = useState<Template[]>(
    []
  );
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(2);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>(error);
  const [collectionType, setCollectionType] = useState<string>(
    defaultCollectionType
  );

  const prefetchNextPage = async () => {
    const prefetchedResult = await getCollection({
      type: defaultCollectionType,
      page: prefetchPageNumber,
    });
    setPrefetchedTemplates(prefetchedResult.message as Template[]);

    if (!prefetchedResult.message.length) {
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
        const result = await getCollection({ type: defaultCollectionType });
        setRenderedTemplates(result.message as Template[]);
        setIsLoading(false);
        await prefetchNextPage();
      } catch (e) {
        setErrorMessage(e.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (currentUser) {
      router.prefetch(`/collection/${currentUser.actor}`);
    }
  }, []);

  const getContent = () => {
    if (!renderedTemplates.length) {
      return (
        <ErrorComponent errorMessage="No templates were found for this collection type." />
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
          isLoading={isLoading}
          items={renderedTemplates}
          type={GRID_TYPE.TEMPLATE}
        />
        <PaginationButton
          onClick={showNextPage}
          isHidden={isLoading}
          isLoading={isLoadingNextPage}
          disabled={prefetchPageNumber === -1}
        />
      </>
    );
  };

  return (
    <PageLayout title="MarketPlace">
      <Title>MarketPlace</Title>
      {getContent()}
    </PageLayout>
  );
};

export const getServerSideProps = async (): Promise<{ props: Props }> => {
  const defaultCollectionType = 'monsters';
  try {
    const allTemplatesResults = await templatesApiService.getAll({
      collection_name: defaultCollectionType,
      page: 1,
      limit: 10,
    });

    if (!allTemplatesResults.success) {
      throw new Error(allTemplatesResults.message as string);
    }

    return {
      props: {
        templates: allTemplatesResults.data,
        error: '',
        defaultCollectionType,
      },
    };
  } catch (e) {
    return {
      props: {
        templates: [],
        error: e.message,
        defaultCollectionType,
      },
    };
  }
};

export default MarketPlace;

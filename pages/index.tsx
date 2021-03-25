import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import Grid from '../components/Grid';
import PaginationButton from '../components/PaginationButton';
import ErrorComponent from '../components/Error';
import LoadingPage from '../components/LoadingPage';
import { useAuthContext } from '../components/Provider';
import Banner from '../components/Banner';
import { Title } from '../styles/Title.styled';
import {
  Template,
  getTemplatesByCollection,
  formatTemplatesWithPriceData,
  getLowestPricesForAllCollectionTemplates,
} from '../services/templates';
import { DEFAULT_COLLECTION } from '../utils/constants';

const MarketPlace = (): JSX.Element => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lowestPrices, setLowestPrices] = useState<{ [id: string]: string }>(
    {}
  );
  const [renderedTemplates, setRenderedTemplates] = useState<Template[]>([]);
  const [prefetchedTemplates, setPrefetchedTemplates] = useState<Template[]>(
    []
  );
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(2);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [collectionType, setCollectionType] = useState<string>(
    DEFAULT_COLLECTION
  );

  const prefetchNextPage = async () => {
    const prefetchedResult = await getTemplatesByCollection({
      type: collectionType,
      page: prefetchPageNumber,
    });
    setPrefetchedTemplates(prefetchedResult as Template[]);

    if (!prefetchedResult.length) {
      setPrefetchPageNumber(-1);
    } else {
      setPrefetchPageNumber(prefetchPageNumber + 1);
    }

    setIsLoadingNextPage(false);
  };

  const showNextPage = async () => {
    const allFetchedTemplates = formatTemplatesWithPriceData(
      renderedTemplates.concat(prefetchedTemplates),
      lowestPrices
    );
    setRenderedTemplates(allFetchedTemplates);
    setIsLoadingNextPage(true);
    await prefetchNextPage();
  };

  useEffect(() => {
    (async () => {
      try {
        const lowestPricesResult = await getLowestPricesForAllCollectionTemplates(
          { type: collectionType }
        );
        setLowestPrices(lowestPricesResult);

        const result = await getTemplatesByCollection({ type: collectionType });
        const templatesWithLowestPrice = formatTemplatesWithPriceData(
          result,
          lowestPricesResult
        );
        setRenderedTemplates(templatesWithLowestPrice);

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
    if (isLoading) {
      return <LoadingPage />;
    }

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
        <Grid isLoading={isLoading} items={renderedTemplates} />
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

export default MarketPlace;

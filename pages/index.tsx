import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import Grid, { GRID_TYPE } from '../components/Grid';
import PaginationButton from '../components/PaginationButton';
import ErrorComponent from '../components/Error';
import LoadingPage from '../components/LoadingPage';
import { useAuthContext } from '../components/Provider';
import { Title } from '../styles/Title.styled';
import { getFromApi } from '../utils/browser-fetch';
import { Template } from '../services/templates';
import { Sale } from '../services/sales';
import { toQueryString, addPrecisionDecimal } from '../utils';
import { TOKEN_SYMBOL } from '../utils/constants';

type GetCollectionOptions = {
  type: string;
  page?: number;
};

type TemplatesById = {
  [id: string]: Template;
};

type GetTemplateLowestPriceDataOptions = {
  templatesById: TemplatesById;
  type: string;
  page?: number;
};

const getTemplateLowestPriceData = async ({
  templatesById,
  type,
  page,
}: GetTemplateLowestPriceDataOptions): Promise<Template[]> => {
  const salesQueryObject = {
    collection_name: type,
    page: page || 1,
    symbol: TOKEN_SYMBOL,
    order: 'desc',
    sort: 'created',
  };

  const salesQueryParams = toQueryString(salesQueryObject);
  const salesResult = await getFromApi<Sale[]>(
    `https://proton.api.atomicassets.io/atomicmarket/v1/sales/templates?${salesQueryParams}`
  );

  if (!salesResult.success) {
    const errorMessage =
      typeof salesResult.error === 'object'
        ? salesResult.error.message
        : salesResult.message;
    throw new Error(errorMessage as string);
  }

  if (!salesResult.data.length) {
    return Object.values(templatesById).map((template) => ({
      ...template,
      lowestPrice: '',
    }));
  }

  const templatesWithLowestPriceData = salesResult.data.map(
    ({ listing_price, assets, price: { token_precision } }) => {
      const {
        template: { template_id },
      } = assets[0];
      return {
        ...templatesById[template_id],
        lowestPrice: `${addPrecisionDecimal(
          listing_price,
          token_precision
        )} ${TOKEN_SYMBOL}`,
      };
    }
  );

  return templatesWithLowestPriceData;
};

const getCollection = async ({
  type,
  page,
}: GetCollectionOptions): Promise<Template[]> => {
  try {
    const templatesQueryObject = {
      collection_name: type,
      page: page || 1,
      limit: 10,
    };

    const templatesQueryParams = toQueryString(templatesQueryObject);
    const templatesResult = await getFromApi<Template[]>(
      `https://proton.api.atomicassets.io/atomicassets/v1/templates?${templatesQueryParams}`
    );

    if (!templatesResult.success) {
      const errorMessage =
        typeof templatesResult.error === 'object'
          ? templatesResult.error.message
          : templatesResult.message;
      throw new Error(errorMessage as string);
    }

    const templatesById: TemplatesById = {};
    for (const template of templatesResult.data) {
      templatesById[template.template_id] = template;
    }

    const templatesWithLowestPriceData = await getTemplateLowestPriceData({
      templatesById,
      type,
      page,
    });

    return templatesWithLowestPriceData as Template[];
  } catch (e) {
    throw new Error(e);
  }
};

const MarketPlace = (): JSX.Element => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [renderedTemplates, setRenderedTemplates] = useState<Template[]>([]);
  const [prefetchedTemplates, setPrefetchedTemplates] = useState<Template[]>(
    []
  );
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(2);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [collectionType, setCollectionType] = useState<string>('monsters');

  const prefetchNextPage = async () => {
    const prefetchedResult = await getCollection({
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
    const allFetchedTemplates = renderedTemplates.concat(prefetchedTemplates);
    setRenderedTemplates(allFetchedTemplates);
    setIsLoadingNextPage(true);
    await prefetchNextPage();
  };

  useEffect(() => {
    (async () => {
      try {
        const result = await getCollection({ type: collectionType });
        setRenderedTemplates(result as Template[]);
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

export default MarketPlace;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import Grid, { GRID_TYPE } from '../components/Grid';
import ErrorComponent from '../components/Error';
import { useAuthContext } from '../components/Provider';
import { Title } from '../styles/Title.styled';
import { getFromApi } from '../utils/browser-fetch';
import { BrowserResponse } from '../utils/browser-fetch';
import { templatesApiService, Template } from '../services/templates';

type Props = {
  templates: Template[];
  error: string;
  defaultCollectionType: string;
};

// Keeping function so that we can eventually use to search for other collection types
const getCollection = async (
  type: string
): Promise<BrowserResponse<Template[]>> => {
  try {
    const result = await getFromApi<Template[]>(
      `/api/get-templates-by-collection?collection=${type}`
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
  const [marketplaceTemplates, setMarketplaceTemplates] = useState<Template[]>(
    templates
  );
  const [errorMessage, setErrorMessage] = useState<string>(error);
  const [collectionType, setCollectionType] = useState<string>(
    defaultCollectionType
  );

  useEffect(() => {
    (async () => {
      try {
        const result = await getCollection(defaultCollectionType);
        setMarketplaceTemplates(result.message as Template[]);
        setIsLoading(false);
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
    if (!marketplaceTemplates.length) {
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
      <Grid
        isLoading={isLoading}
        items={marketplaceTemplates}
        type={GRID_TYPE.TEMPLATE}
      />
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

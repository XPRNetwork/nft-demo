import { useState } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import Grid, { GRID_TYPE } from '../components/Grid';
import ErrorComponent from '../components/Error';
import { Title } from '../styles/Title.styled';
import { getFromApi } from '../utils/browser-fetch';
import { APIResponse } from '../utils/node-fetch';
import { getTemplatesByCollection, Template } from '../services/templates';

type Props = {
  templates: Template[];
  error: string;
  defaultCollectionType: string;
};

// Keeping function so that we can eventually use to search for other collection types
const getCollection = async (
  type: string
): Promise<APIResponse<Template[]>> => {
  try {
    const result = await getFromApi<Template[]>(
      `/api/get-templates-by-collection?collection=${type}`
    );

    if (!result.success) {
      throw new Error((result.message as unknown) as string);
    }

    return result.message;
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
  const [marketplaceTemplates, setMarketplaceTemplates] = useState<Template[]>(
    templates
  );
  const [errorMessage, setErrorMessage] = useState<string>(error);
  const [collectionType, setCollectionType] = useState<string>(
    defaultCollectionType
  );

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

    return <Grid items={marketplaceTemplates} type={GRID_TYPE.TEMPLATE} />;
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
    const templates = (await getTemplatesByCollection(
      defaultCollectionType
    )) as Template[];
    return {
      props: {
        templates,
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

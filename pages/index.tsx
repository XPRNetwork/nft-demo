import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import Grid, { GRID_TYPE } from '../components/Grid';
import { Title } from '../styles/Title.styled';
import { getFromApi } from '../utils/browser-fetch';
import { APIResponse } from '../utils/node-fetch';
import {
  getTemplatesByCollection,
  getTemplateDetail,
  Template,
} from '../services/templates';

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
    // this result is what you'll use to render the grid
    // if there are no prices, there will be either a null in "lowestPrice" or just no "lowestPrice" key
  } catch (e) {
    throw new Error(e);
  }
};

const MarketPlace = ({
  templates,
  error,
  defaultCollectionType,
}: Props): JSX.Element => {
  const [marketplaceTemplates, setMarketplaceTemplates] = useState<Template[]>(
    templates
  );
  const [marketError, setMarketError] = useState<string>(error);
  const [collectionType, setCollectionType] = useState<string>(
    defaultCollectionType
  );

  return (
    <PageLayout title="MarketPlace">
      <Title>MarketPlace</Title>
      <Grid items={marketplaceTemplates} type={GRID_TYPE.TEMPLATE} />
      {marketError}
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

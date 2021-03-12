import React, { useState } from 'react';
import DetailsLayout from '../components/DetailsLayout';
import { getTemplateDetail, Template } from '../services/templates';

type Props = {
  template: Template;
  error: string;
};

const MarketplaceTemplateDetail = ({ template, error }: Props): JSX.Element => {
  const [detailsError, setDetailsError] = useState<string>(error);
  const {
    lowestPrice,
    highestPrice,
    immutable_data: { image, series, name },
  } = template;

  // TODO: readd MarketPlaceDetails
  return (
    <DetailsLayout
      name={name}
      seriesNumber={series.toString()}
      details={'Test Details'}
      image={image as string}>
      {/* <MarketPlaceDetails
        template={currentTemplate}
        lowestTemplate={lowestTemplate}
        highestTemplate={highestTemplate}
      /> */}
      {detailsError}
    </DetailsLayout>
  );
};

type GetServerSidePropsContext = {
  params: {
    templateId: string;
  };
};

export const getServerSideProps = async ({
  params: { templateId },
}: GetServerSidePropsContext): Promise<{ props: Props }> => {
  const defaultCollectionType = 'monsters';
  try {
    const template = (await getTemplateDetail(
      defaultCollectionType,
      templateId
    )) as Template;

    return {
      props: {
        template: template,
        error: '',
      },
    };
  } catch (e) {
    return {
      props: {
        template: {
          lowestPrice: '',
          highestPrice: '',
          immutable_data: {
            image: '',
            name: '',
            series: 0,
          },
        },
        error: e.message,
      },
    };
  }
};

export default MarketplaceTemplateDetail;

import { useRouter } from 'next/router';
import DetailsLayout from '../components/DetailsLayout';
import ErrorComponent from '../components/Error';
import { getTemplateDetail, Template } from '../services/templates';
import { getSaleAssetsByTemplateId, SaleAsset } from '../services/sales';
import PageLayout from '../components/PageLayout';
import BuyAssetForm from '../components/BuyAssetForm';

type Props = {
  template: Template;
  allSalesForTemplate: SaleAsset[];
  error: string;
};

const MarketplaceTemplateDetail = ({
  template,
  error,
  allSalesForTemplate,
}: Props): JSX.Element => {
  const router = useRouter();

  const {
    lowestPrice,
    highestPrice,
    max_supply,
    immutable_data: { image, series, name },
  } = template;

  const getContent = () => {
    if (error) {
      return (
        <ErrorComponent
          errorMessage={error}
          buttonText="Try again"
          buttonOnClick={() => router.reload()}
        />
      );
    }

    return (
      <DetailsLayout
        name={name}
        seriesNumber={series.toString()}
        details="Item details"
        image={image as string}>
        <BuyAssetForm
          lowestPrice={lowestPrice}
          highestPrice={highestPrice}
          maxSupply={max_supply}
          allSalesForTemplate={allSalesForTemplate}
        />
      </DetailsLayout>
    );
  };

  return <PageLayout title={`${name} Details`}>{getContent()}</PageLayout>;
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

    const allSalesForTemplate = await getSaleAssetsByTemplateId(templateId);

    return {
      props: {
        template: template,
        allSalesForTemplate: allSalesForTemplate,
        error: '',
      },
    };
  } catch (e) {
    return {
      props: {
        template: {
          lowestPrice: '',
          highestPrice: '',
          max_supply: '',
          immutable_data: {
            image: '',
            name: '',
            series: 0,
          },
        },
        allSalesForTemplate: [],
        error: e.message,
      },
    };
  }
};

export default MarketplaceTemplateDetail;
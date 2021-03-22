import { useRouter } from 'next/router';
import DetailsLayout from '../components/DetailsLayout';
import ErrorComponent from '../components/Error';
import { getTemplateDetail, Template } from '../services/templates';
import { getSalesHistoryForTemplate, Sale } from '../services/sales';
import PageLayout from '../components/PageLayout';
import BuyAssetForm from '../components/BuyAssetForm';

type Props = {
  template: Template;
  error: string;
  salesHistory: Sale[];
};

const MarketplaceTemplateDetail = ({
  template,
  error,
  salesHistory,
}: Props): JSX.Element => {
  const router = useRouter();

  const {
    lowestPrice,
    highestPrice,
    max_supply,
    immutable_data: { image, series, name },
    template_id,
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
        sales={salesHistory}
        error={error}
        image={image as string}
        template_id={template_id}
        max_supply={max_supply}>
        <BuyAssetForm
          templateId={template_id}
          lowestPrice={lowestPrice}
          highestPrice={highestPrice}
          maxSupply={max_supply}
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

    const salesHistory = await getSalesHistoryForTemplate(templateId);

    return {
      props: {
        template: template,
        salesHistory: salesHistory,
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
        error: e.message,
        salesHistory: [],
      },
    };
  }
};

export default MarketplaceTemplateDetail;

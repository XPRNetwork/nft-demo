import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DetailsLayout from '../components/DetailsLayout';
import ErrorComponent from '../components/Error';
import { getTemplateDetails, Template } from '../services/templates';
import { getSalesHistoryForTemplate, Sale } from '../services/sales';
import PageLayout from '../components/PageLayout';
import BuyAssetForm from '../components/BuyAssetForm';
import { DEFAULT_COLLECTION } from '../utils/constants';
import LoadingPage from '../components/LoadingPage';

const emptyTemplateDetails = {
  lowestPrice: '',
  highestPrice: '',
  max_supply: '',
  immutable_data: {
    image: '',
    name: '',
    series: 0,
  },
};

type Query = {
  [query: string]: string;
};

const MarketplaceTemplateDetail = (): JSX.Element => {
  const router = useRouter();
  const { templateId } = router.query as Query;
  const [sales, setSales] = useState<Sale[]>([]);
  const [template, setTemplate] = useState<Template>(emptyTemplateDetails);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const {
    lowestPrice,
    highestPrice,
    max_supply,
    immutable_data: { image, series, name },
    template_id,
  } = template;

  useEffect(() => {
    if (templateId) {
      try {
        (async () => {
          const templateDetails = await getTemplateDetails(
            DEFAULT_COLLECTION,
            templateId
          );
          const sales = await getSalesHistoryForTemplate(templateId);
          setTemplate(templateDetails);
          setSales(sales);
          setIsLoading(false);
        })();
      } catch (e) {
        setError(e.message);
      }
    }
  }, [templateId]);

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

    if (isLoading) {
      return <LoadingPage />;
    }

    return (
      <DetailsLayout
        name={name}
        seriesNumber={series.toString()}
        sales={sales}
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

export default MarketplaceTemplateDetail;

import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { getFromApi } from '../utils/browser-fetch';

const MarketPlace = (): JSX.Element => {
  const [marketError, setMarketError] = useState('');

  useEffect(() => {
    getCollection('monsters');
  }, []);

  const getCollection = async (type) => {
    try {
      const result = await getFromApi(
        `/api/get-templates-by-collection?collection=${type}`
      );
      console.log('result', result);
      // this result is what you'll use to render the grid
      // if there are no prices, there will be either a null in "lowestPrice" or just no "lowestPrice" key
    } catch (e) {
      setMarketError(e.message || 'Error!');
    }
  };

  return (
    <PageLayout title="MarketPlace" pageTitle="Market Place">
      <div>MarketPlace</div>
      {marketError}
    </PageLayout>
  );
};

export default MarketPlace;

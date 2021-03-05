import { useEffect, useState } from 'react';
import { getFromApi } from '../utils/browser-fetch';
import PageLayout from '../components/PageLayout';

const Collection = (): JSX.Element => {
  const [collectionError, setCollectionError] = useState('');

  useEffect(() => {
    getMyAssets();
  }, []);

  const getMyAssets = async () => {
    try {
      const result = await getFromApi(
        `/api/my-assets?owner=testuser1111` //insert logged in user's name here
      );
      console.log('result', result);
      // this result is what you'll use to render the grid
      // if there's no result, then there should be an empty state here
      // if an asset is for sale (for the little badge on the asset), there will be a "forSale: true" in the asset object.
      // If there is no forSale property or it is false, then the asset is not for sale.
    } catch (e) {
      setCollectionError(e.message || 'Error!');
    }
  };

  return (
    <PageLayout title="Collection" pageTitle="Collection">
      <div>Collection</div>
      {collectionError}
    </PageLayout>
  );
};

export default Collection;

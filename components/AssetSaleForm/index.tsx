import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ProtonSDK from '../../services/proton';
import Button from '../Button';
import { useAuthContext } from '../Provider';
import { General, Input } from '../../styles/details.styled';

type Props = {
  asset_id: string;
};

const AssetSaleForm = ({ asset_id }: Props): JSX.Element => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const [assetPrice, setAssetPrice] = useState(null);

  const handleChange = (e) => {
    setAssetPrice(e.target.value);
  };

  const parsePrice = (price) => {
    return parseFloat(price).toFixed(4);
  };

  const createSale = async () => {
    const res = await ProtonSDK.createSale({
      seller: currentUser ? currentUser.actor : '',
      asset_id,
      price: `${parsePrice(assetPrice)} XPR`,
      currency: '4,XPR',
    });

    if (res.success) {
      router.reload();
    }
  };

  return (
    <section>
      <General>Sales Price (XPR)</General>
      <Input
        onChange={handleChange}
        placeholder="Enter Price"
        value={assetPrice}
        type="number"
        pattern="[0-9]*"
      />
      <Button filled rounded fullWidth onClick={createSale}>
        Mark for sale
      </Button>
    </section>
  );
};

export default AssetSaleForm;

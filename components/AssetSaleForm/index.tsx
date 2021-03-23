import React, { useState } from 'react';
import ProtonSDK from '../../services/proton';
import Button from '../Button';
import PriceInput from '../PriceInput';
import { useAuthContext } from '../Provider';
import { General } from '../../styles/details.styled';
import { TOKEN_SYMBOL, TOKEN_PRECISION } from '../../utils/constants';

type Props = {
  asset_id: string;
  setShouldGetAssetDetails: (boolean) => void;
};

const AssetSaleForm = ({
  asset_id,
  setShouldGetAssetDetails,
}: Props): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [amount, setAmount] = useState<string>('');

  const createSale = async () => {
    const formattedAmount = parseFloat(amount).toFixed(TOKEN_PRECISION);
    const res = await ProtonSDK.createSale({
      seller: currentUser ? currentUser.actor : '',
      asset_id,
      price: `${formattedAmount} ${TOKEN_SYMBOL}`,
      currency: `${TOKEN_PRECISION},${TOKEN_SYMBOL}`,
    });

    if (res.success) {
      setShouldGetAssetDetails(true);
    }
  };

  return (
    <section>
      <General>Sales Price ({TOKEN_SYMBOL})</General>
      <PriceInput
        amount={amount}
        setAmount={setAmount}
        submit={() => createSale()}
        placeholder="Enter Price"
      />
      <Button filled rounded fullWidth onClick={createSale}>
        Mark for sale
      </Button>
    </section>
  );
};

export default AssetSaleForm;

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ProtonSDK from '../../services/proton';
import Button from '../Button';
import PriceInput from '../PriceInput';
import { useAuthContext } from '../Provider';
import { General } from '../../styles/details.styled';
import { TOKEN_SYMBOL, TOKEN_PRECISION } from '../../utils/constants';

type Props = {
  asset_id: string;
};

const AssetSaleForm = ({ asset_id }: Props): JSX.Element => {
  const router = useRouter();
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
      router.replace(router.asPath);
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

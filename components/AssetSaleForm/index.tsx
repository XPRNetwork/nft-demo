import React, { useState, ChangeEvent } from 'react';
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
  const [amount, setAmount] = useState<string>('');

  const updateNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const inputAmount = e.target.value;
    const floatAmount = parseFloat(inputAmount);
    const formattedAmount = floatAmount.toFixed(4);

    if (floatAmount < 0) {
      setAmount('0');
      return;
    }

    if (floatAmount > 1000000000) {
      setAmount('1000000000');
      return;
    }

    if (inputAmount.length > formattedAmount.length) {
      setAmount(formattedAmount);
      return;
    }

    setAmount(inputAmount);
  };

  const formatNumber = () => {
    const numberAmount = parseFloat(amount).toFixed(6);
    setAmount(numberAmount);
  };

  const createSale = async () => {
    const res = await ProtonSDK.createSale({
      seller: currentUser ? currentUser.actor : '',
      asset_id,
      price: `${amount} FOOBAR`,
      currency: '6,FOOBAR',
    });

    if (res.success) {
      router.reload();
    }
  };

  return (
    <section>
      <General>Sales Price (FOOBAR)</General>
      <Input
        required
        type="number"
        min="0"
        max="1000000000"
        step="0.0001"
        inputMode="decimal"
        placeholder="Enter Price"
        value={amount}
        onBlur={formatNumber}
        onChange={updateNumber}
      />
      <Button filled rounded fullWidth onClick={createSale}>
        Mark for sale
      </Button>
    </section>
  );
};

export default AssetSaleForm;

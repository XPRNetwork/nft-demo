/* eslint-disable react/jsx-no-target-blank */
import { useState } from 'react';
import ProtonSDK from '../services/proton';
import PageLayout from '../components/PageLayout';
import { useAuthContext } from '../components/Provider';
import { getSaleAssetsByTemplateId } from '../services/sales';

const Test = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [assetId, setAssetId] = useState('');
  const [saleId, setSaleId] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('');
  const [purchaseSaleId, setPurchaseSaleId] = useState('');

  const createSale = async () => {
    const res = await ProtonSDK.createSale({
      seller: currentUser ? currentUser.actor : '',
      asset_id: assetId,
      price,
      currency,
    });
    console.log(res);
  };

  const cancelSale = async () => {
    const res = await ProtonSDK.cancelSale({
      actor: currentUser ? currentUser.actor : '',
      sale_id: saleId,
    });
    console.log(res);
  };

  const purchaseSale = async () => {
    const res = await ProtonSDK.purchaseSale({
      buyer: currentUser ? currentUser.actor : '',
      sale_id: purchaseSaleId,
    });
    console.log(res);
  };

  const deposit = async () => {
    const res = await ProtonSDK.deposit({
      actor: currentUser ? currentUser.actor : '',
      amount: '1.0000 FOOBAR',
    });
    console.log('deposit: ', res);
  };

  const withdraw = async () => {
    const res = await ProtonSDK.withdraw({
      actor: currentUser ? currentUser.actor : '',
      amount: '1.0000 FOOBAR',
    });
    console.log('withdraw: ', res);
  };

  return (
    <PageLayout title="Test">
      <br />
      <br />
      <h1>Test ProtonSDK.createSale</h1>
      <br />
      <input
        type="number"
        value={assetId}
        placeholder="ASSET ID"
        onChange={(e) => setAssetId(e.target.value)}
      />
      <input
        step="any"
        type="text"
        value={price}
        placeholder="PRICE (i.e. '1.0000 FOOBAR')"
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        value={currency}
        placeholder="CURRENCY (i.e. '4,FOOBAR')"
        onChange={(e) => setCurrency(e.target.value)}
      />
      <button onClick={createSale}>CREATE SALE</button>
      <br />
      <br />
      <h1>Test ProtonSDK.cancelSale</h1>
      <br />
      <input
        value={saleId}
        placeholder="SALE ID"
        onChange={(e) => setSaleId(e.target.value)}
      />
      <button onClick={cancelSale}>CANCEL SALE</button>
      <br />

      <h1>Test ProtonSDK.purchaseSale</h1>
      <br />
      <input
        value={purchaseSaleId}
        type="text"
        placeholder="SALE ID"
        onChange={(e) => setPurchaseSaleId(e.target.value)}
      />
      <button onClick={purchaseSale}>PURCHASE SALE</button>
      <br />

      <button onClick={deposit}>Deposit 1 FOOBAR</button>
      <br />
      <p>
        Visit this page to see account balances:
        <a
          href="https://proton-test.bloks.io/account/atomicmarket?loadContract=true&tab=Tables&account=atomicmarket&scope=atomicmarket&limit=100&table=balances"
          target="_blank"
          style={{ color: 'blue' }}>
          Atomic Market Balances
        </a>
      </p>
      <button onClick={withdraw}>Withdraw 1 FOOBAR</button>
    </PageLayout>
  );
};

export const getServerSideProps = async (): Promise<{
  props: Record<string, never>;
}> => {
  const saleAssets = await getSaleAssetsByTemplateId('14'); // TODO: Move to `[templateId].tsx`
  console.log(saleAssets);
  return {
    props: {},
  };
};

export default Test;

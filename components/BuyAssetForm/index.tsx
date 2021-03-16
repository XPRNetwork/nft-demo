import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ProtonSDK from '../../services/proton';
import { SaleAsset } from '../../services/sales';
import Button from '../Button';
import { General, Amount, Row, Divider } from '../../styles/details.styled';
import { Error, DropdownMenu } from './BuyAssetForm.styled';
import { useAuthContext } from '../Provider';

type Props = {
  lowestPrice: string;
  highestPrice: string;
  maxSupply: string;
  allSalesForTemplate: SaleAsset[];
};

const BuyAssetForm = ({
  lowestPrice,
  highestPrice,
  maxSupply,
  allSalesForTemplate,
}: Props): JSX.Element => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const [purchasingError, setPurchasingError] = useState('');
  const [saleId, setSaleId] = useState('');

  const buyAsset = async () => {
    setPurchasingError('');
    try {
      const purchaseResult = await ProtonSDK.purchaseSale({
        buyer: currentUser ? currentUser.actor : '',
        sale_id: saleId,
      });
      if (purchaseResult.success) {
        router.reload();
      } else {
        throw purchaseResult.error;
      }
    } catch (e) {
      setPurchasingError(e);
    }
  };

  return (
    <section>
      <Row>
        <General>Edition Size</General>
        <General>For Sale</General>
      </Row>
      <Row>
        <p>{maxSupply}</p>
        <p>{allSalesForTemplate.length}</p>
      </Row>
      <Divider />
      <General>Lowest Price</General>
      <Amount>{lowestPrice ? lowestPrice : 'None'}</Amount>
      <General>Highest Price</General>
      <Amount>{highestPrice ? highestPrice : 'None'}</Amount>
      <General>Serial number</General>
      <DropdownMenu
        name="Available Assets For Sale"
        value={saleId}
        onChange={(e) => setSaleId(e.target.value)}>
        <option key="blank" value="">
          - - Select a serial number - -
        </option>
        {allSalesForTemplate.length > 0 &&
          allSalesForTemplate.map((sale) => {
            return (
              <option
                key={sale.saleId}
                value={sale.saleId}
                selected={sale.saleId === saleId}>
                #{sale.templateMint} - {sale.salePrice}
              </option>
            );
          })}
      </DropdownMenu>
      <Button fullWidth filled rounded onClick={buyAsset}>
        Buy
      </Button>
      {purchasingError ? <Error>{purchasingError}</Error> : null}
    </section>
  );
};

export default BuyAssetForm;

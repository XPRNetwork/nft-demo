import React, { Dispatch, SetStateAction } from 'react';
import Button from '../Button';
import { useModalContext, MODAL_TYPES } from '../Provider';
import { General } from '../../styles/details.styled';
import { TOKEN_SYMBOL } from '../../utils/constants';

type Props = {
  asset_id: string;
  setShouldReload: Dispatch<SetStateAction<boolean>>;
};

const AssetSaleForm = ({ asset_id, setShouldReload }: Props): JSX.Element => {
  const { openModal, setModalProps } = useModalContext();
  return (
    <section>
      <General>Sales Price ({TOKEN_SYMBOL})</General>
      <Button
        filled
        rounded
        fullWidth
        onClick={() => {
          openModal(MODAL_TYPES.CREATE_SALE);
          setModalProps({
            assetId: asset_id,
            setShouldReload,
          });
        }}>
        Mark for sale
      </Button>
      <Button
        filled
        rounded
        fullWidth
        onClick={() => {
          openModal(MODAL_TYPES.CREATE_MULTIPLE_SALES);
          setModalProps({
            assetIds: [asset_id],
            setShouldReload,
          });
        }}>
        (TEST) Mark all for sale
      </Button>
    </section>
  );
};

export default AssetSaleForm;

import React, { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { useModalContext, MODAL_TYPES } from '../Provider';
import Button from '../Button';
import { General, Amount } from '../../styles/details.styled';
import { EMPTY_BALANCE } from '../../utils/constants';

type Props = {
  saleId: string;
  salePrice: string;
  isOwner: boolean;
  template_id: string;
  setShouldReload: Dispatch<SetStateAction<boolean>>;
};

const AssetSaleDetails = ({
  saleId,
  salePrice,
  isOwner,
  template_id,
  setShouldReload,
}: Props): JSX.Element => {
  const router = useRouter();
  const { openModal, setModalProps } = useModalContext();

  return (
    <section>
      <General>For Sale</General>
      <Amount>{salePrice ? salePrice : EMPTY_BALANCE}</Amount>
      <Button fullWidth onClick={() => router.push(`/${template_id}`)}>
        View Listing
      </Button>
      {isOwner ? (
        <>
          <Button
            fullWidth
            filled
            rounded
            onClick={() => {
              openModal(MODAL_TYPES.CANCEL_SALE);
              setModalProps({
                saleId,
                setShouldReload,
              });
            }}>
            Cancel Sale
          </Button>
          <Button
            fullWidth
            filled
            rounded
            onClick={() => {
              openModal(MODAL_TYPES.CANCEL_ALL_SALES);
              setModalProps({
                saleIds: [saleId],
                setShouldReload,
              });
            }}>
            (TEST) Cancel All Sales
          </Button>
        </>
      ) : (
        ''
      )}
    </section>
  );
};

export default AssetSaleDetails;

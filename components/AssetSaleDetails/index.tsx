import React, { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '../Provider';
import ProtonSDK from '../../services/proton';
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
  const { currentUser } = useAuthContext();

  const cancelSale = async () => {
    const res = await ProtonSDK.cancelSale({
      actor: currentUser ? currentUser.actor : '',
      sale_id: saleId,
    });

    if (res.success) {
      setShouldReload(true);
    }
  };

  return (
    <section>
      <General>For Sale</General>
      <Amount>{salePrice ? salePrice : EMPTY_BALANCE}</Amount>
      <Button fullWidth onClick={() => router.push(`/${template_id}`)}>
        View Listing
      </Button>
      {isOwner ? (
        <Button fullWidth filled rounded onClick={cancelSale}>
          Cancel Sale
        </Button>
      ) : (
        ''
      )}
    </section>
  );
};

export default AssetSaleDetails;

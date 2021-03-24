import { MouseEvent } from 'react';
import {
  useAuthContext,
  useModalContext,
  CancelSaleModalProps,
  CancelAllSalesModalProps,
} from '../Provider';
import Button from '../Button';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Description,
} from './Modal.styled';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import ProtonSDK from '../../services/proton';

type Props = {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => Promise<void>;
};

const CancelModal = ({
  title,
  description,
  buttonText,
  onButtonClick,
}: Props): JSX.Element => {
  const { closeModal } = useModalContext();

  const handleBackgroundClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <Background onClick={handleBackgroundClick}>
      <ModalBox>
        <Section>
          <Title>{title}</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Description>{description}</Description>
        <Button
          fullWidth
          filled
          rounded
          color="#fb849a"
          hoverColor="#ff778e"
          onClick={onButtonClick}>
          {buttonText}
        </Button>
      </ModalBox>
    </Background>
  );
};

export const CancelSaleModal = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const { closeModal, modalProps } = useModalContext();
  const { saleId, setShouldReload } = modalProps as CancelSaleModalProps;

  const cancelSale = async () => {
    const res = await ProtonSDK.cancelSale({
      actor: currentUser ? currentUser.actor : '',
      sale_id: saleId,
    });

    if (res.success) {
      closeModal();
      setShouldReload(true);
    }
  };

  return (
    <CancelModal
      title="Cancel Sale?"
      description="By canceling sale your NFT will be removed from the marketplace until
          you market for sale again."
      buttonText="Cancel Sale"
      onButtonClick={cancelSale}
    />
  );
};

export const CancelAllSalesModal = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const { closeModal, modalProps } = useModalContext();
  const { saleIds, setShouldReload } = modalProps as CancelAllSalesModalProps;

  const onButtonClick = async () => {
    try {
      console.log(
        `${currentUser.actor} is canceling the following sales: ${saleIds.join(
          ', '
        )}`
      );
      closeModal();
      setShouldReload(true);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return (
    <CancelModal
      title="Cancel Sales?"
      description={`You are canceling ${saleIds.length} items for sale. By canceling sales your NFTs will be removed from the marketplace until
          you market them for sale again.`}
      buttonText="Cancel All Sales"
      onButtonClick={onButtonClick}
    />
  );
};

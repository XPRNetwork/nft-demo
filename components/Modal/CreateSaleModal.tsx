import { useState, MouseEvent, Dispatch, SetStateAction } from 'react';
import {
  useAuthContext,
  useModalContext,
  CreateSaleModalProps,
  CreateMultipleSalesModalProps,
} from '../Provider';
import PriceInput from '../PriceInput';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Description,
  InputLabel,
  Row,
  Spacer,
  HalfButton,
} from './Modal.styled';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import { TOKEN_SYMBOL, TOKEN_PRECISION } from '../../utils/constants';
import ProtonSDK from '../../services/proton';

type Props = {
  title: string;
  description: string;
  buttonText: string;
  amount: string;
  onButtonClick: () => Promise<void>;
  setAmount: Dispatch<SetStateAction<string>>;
};

const SaleModal = ({
  title,
  description,
  buttonText,
  amount,
  setAmount,
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
        <InputLabel>
          NFT Price
          <PriceInput
            amount={amount}
            setAmount={setAmount}
            submit={null}
            placeholder={`Enter amount (${TOKEN_SYMBOL})`}
          />
        </InputLabel>
        <Row>
          <Spacer />
          <HalfButton filled rounded onClick={onButtonClick}>
            {buttonText}
          </HalfButton>
        </Row>
      </ModalBox>
    </Background>
  );
};

export const CreateSaleModal = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const { closeModal, modalProps } = useModalContext();
  const { assetId, setShouldReload } = modalProps as CreateSaleModalProps;
  const [amount, setAmount] = useState<string>('');

  const createOneSale = async () => {
    const formattedAmount = parseFloat(amount).toFixed(TOKEN_PRECISION);
    const res = await ProtonSDK.createSale({
      seller: currentUser ? currentUser.actor : '',
      asset_id: assetId,
      price: `${formattedAmount} ${TOKEN_SYMBOL}`,
      currency: `${TOKEN_PRECISION},${TOKEN_SYMBOL}`,
    });

    if (res.success) {
      closeModal();
      setShouldReload(true);
    }
  };

  return (
    <SaleModal
      title="Listing Price"
      description="Enter the amount you want to sell your NFT for."
      buttonText="Mark for sale"
      amount={amount}
      setAmount={setAmount}
      onButtonClick={createOneSale}
    />
  );
};

export const CreateMultipleSalesModal = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const { closeModal, modalProps } = useModalContext();
  const {
    assetIds,
    setShouldReload,
  } = modalProps as CreateMultipleSalesModalProps;
  const [amount, setAmount] = useState<string>('');

  const createMultipleSales = async () => {
    try {
      const formattedAmount = parseFloat(amount).toFixed(TOKEN_PRECISION);
      const res = await ProtonSDK.createMultipleSales({
        seller: currentUser ? currentUser.actor : '',
        assetIds,
        price: `${formattedAmount} ${TOKEN_SYMBOL}`,
        currency: `${TOKEN_PRECISION},${TOKEN_SYMBOL}`,
      });

      if (res.success) {
        closeModal();
        setShouldReload(true);
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return (
    <SaleModal
      title="Listing Price"
      description={`You are putting up ${assetIds.length} items for sale. Enter the amount you want to sell each of your NFTs for.`}
      buttonText="Mark all for sale"
      amount={amount}
      setAmount={setAmount}
      onButtonClick={createMultipleSales}
    />
  );
};

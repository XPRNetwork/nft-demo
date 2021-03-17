import { useState, useEffect, MouseEvent } from 'react';
import { useAuthContext, useModalContext, MODAL_TYPES } from '../Provider';
import Button from '../Button';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Description,
  InputLabel,
  Input,
  ErrorMessage,
  ButtonContainer,
  LinkButton,
  WithdrawInputLabel,
  AvailableBalance,
} from './Modal.styled';
import ProtonSDK from '../../services/proton';
import { ReactComponent as CloseIcon } from '../../public/close.svg';

export const WithdrawModal = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const { openModal, closeModal } = useModalContext();
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (error) setError('');
  }, []);

  const withdraw = async () => {
    try {
      const res = await ProtonSDK.withdraw({
        actor: currentUser ? currentUser.actor : '',
        amount: `${amount} XPR`,
      });

      if (!res.success) {
        throw new Error('Unable to make withdrawal.');
      }

      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateNumber = (e) => {
    const inputAmount = e.target.value;
    const formattedAmount = parseFloat(inputAmount).toFixed(4);

    if (inputAmount.length > formattedAmount.length) {
      setAmount(formattedAmount);
    } else {
      setAmount(inputAmount);
    }
  };

  const formatNumber = () => {
    const numberAmount = parseFloat(amount).toFixed(4);
    setAmount(numberAmount);
  };

  const handleBackgroundClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <Background onClick={handleBackgroundClick}>
      <ModalBox>
        <Section>
          <Title>Withdraw balance</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Description>
          You have tokens stored in a smart contract. Withdraw them to your
          Proton wallet at any time.
        </Description>
        <InputLabel>
          <WithdrawInputLabel>
            <span>Withdraw Funds</span>
            <AvailableBalance>{currentUser.balance}</AvailableBalance>
          </WithdrawInputLabel>
          <Input
            required
            min="0"
            type="number"
            step="0.0001"
            inputMode="decimal"
            placeholder="Enter amount (XPR)"
            value={amount}
            onBlur={formatNumber}
            onChange={updateNumber}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputLabel>
        <ButtonContainer>
          <LinkButton onClick={() => openModal(MODAL_TYPES.DEPOSIT)}>
            Fund balance
          </LinkButton>
          <Button fullWidth filled onClick={withdraw}>
            Withdraw Funds
          </Button>
        </ButtonContainer>
      </ModalBox>
    </Background>
  );
};

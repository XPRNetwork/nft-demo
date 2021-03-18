import { useState, useEffect, MouseEvent, ChangeEvent } from 'react';
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
  const {
    currentUser,
    currentUserBalance,
    updateCurrentUserBalance,
  } = useAuthContext();
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
        amount: `${amount} FOOBAR`,
      });

      if (!res.success) {
        throw new Error('Unable to make withdrawal.');
      }

      closeModal();
      await updateCurrentUserBalance(currentUser.actor);
    } catch (err) {
      setError(err.message);
    }
  };

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
            <AvailableBalance>{currentUserBalance}</AvailableBalance>
          </WithdrawInputLabel>
          <Input
            required
            type="number"
            min="0"
            max="1000000000"
            step="0.0001"
            inputMode="decimal"
            placeholder="Enter amount (FOOBAR)"
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

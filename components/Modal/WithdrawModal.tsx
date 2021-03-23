import { useState, useEffect, MouseEvent } from 'react';
import { useAuthContext, useModalContext } from '../Provider';
import Button from '../Button';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Description,
  InputLabel,
  ErrorMessage,
  WithdrawInputLabel,
  AvailableBalance,
} from './Modal.styled';
import PriceInput from '../PriceInput';
import ProtonSDK from '../../services/proton';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import { TOKEN_SYMBOL, TOKEN_PRECISION } from '../../utils/constants';

export const WithdrawModal = (): JSX.Element => {
  const {
    currentUser,
    currentUserBalance,
    updateCurrentUserBalance,
    updateAtomicBalance,
  } = useAuthContext();
  const { closeModal } = useModalContext();
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (error) setError('');
  }, []);

  const withdraw = async () => {
    try {
      const formattedAmount = parseFloat(amount).toFixed(TOKEN_PRECISION);
      const res = await ProtonSDK.withdraw({
        actor: currentUser ? currentUser.actor : '',
        amount: `${formattedAmount} ${TOKEN_SYMBOL}`,
      });

      if (!res.success) {
        throw new Error('Unable to make withdrawal.');
      }

      closeModal();
      await updateCurrentUserBalance(currentUser.actor);
      await updateAtomicBalance(currentUser.actor);
    } catch (err) {
      setError(err.message);
    }
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
          <PriceInput
            amount={amount}
            setAmount={setAmount}
            submit={() => withdraw()}
            placeholder={`Enter amount (${TOKEN_SYMBOL})`}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputLabel>
        <Button fullWidth filled onClick={withdraw}>
          Withdraw Funds
        </Button>
      </ModalBox>
    </Background>
  );
};

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
  ErrorMessage,
  LinkButton,
  LinkDescription,
  StyledLink,
  WithdrawInputLabel,
  AvailableBalance,
} from './Modal.styled';
import PriceInput from '../PriceInput';
import ProtonSDK from '../../services/proton';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import { TOKEN_SYMBOL, TOKEN_PRECISION } from '../../utils/constants';

export const DepositModal = (): JSX.Element => {
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

  const deposit = async () => {
    try {
      const formattedAmount = parseFloat(amount).toFixed(TOKEN_PRECISION);
      const res = await ProtonSDK.deposit({
        actor: currentUser ? currentUser.actor : '',
        amount: `${formattedAmount} ${TOKEN_SYMBOL}`,
      });

      if (!res.success) {
        throw new Error('Unable to make deposit.');
      }

      closeModal();
      await updateCurrentUserBalance(currentUser.actor);
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
          <Title>Monster balance</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Description>
          Proton NFT balances are stored in a smart contract on chain. You can
          withdraw at any time.
        </Description>
        <InputLabel>
          <WithdrawInputLabel>
            <span>Add funds to your balance</span>
            <AvailableBalance>{currentUserBalance}</AvailableBalance>
          </WithdrawInputLabel>
          <PriceInput
            amount={amount}
            setAmount={setAmount}
            submit={() => deposit()}
            placeholder={`Enter amount (${TOKEN_SYMBOL})`}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputLabel>
        <LinkButton onClick={() => openModal(MODAL_TYPES.WITHDRAW)}>
          Withdraw balance
        </LinkButton>
        <Button fullWidth filled onClick={deposit}>
          Add Funds
        </Button>
        <LinkDescription>
          Need Foobar? Click{' '}
          <StyledLink
            href="https://foobar.protonchain.com/"
            target="_blank"
            rel="noreferrer">
            here
          </StyledLink>
          .
        </LinkDescription>
      </ModalBox>
    </Background>
  );
};

import { useState, useEffect, MouseEvent } from 'react';
import { useAuthContext, useModalContext } from '../Provider';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Description,
  Row,
  Spacer,
  HalfButton,
} from './Modal.styled';
import ProtonSDK from '../../services/proton';
import { formatPrice } from '../../utils';
import { ReactComponent as CloseIcon } from '../../public/close.svg';

export const ClaimModal = (): JSX.Element => {
  const { currentUser, atomicMarketBalance, updateBalances } = useAuthContext();
  const { closeModal } = useModalContext();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (error) setError('');
  }, []);

  const withdraw = async () => {
    try {
      const res = await ProtonSDK.withdraw({
        actor: currentUser ? currentUser.actor : '',
        amount: `${atomicMarketBalance}`,
      });

      if (!res.success) {
        throw new Error('Unable to make withdrawal.');
      }

      closeModal();
      await updateBalances(currentUser.actor);
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
          <Title>Claim {formatPrice(atomicMarketBalance)}</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Description>
          Congratulations, You sold {formatPrice(atomicMarketBalance)} of NFTs.
          Claim them now!
        </Description>
        <Row>
          <Spacer />
          <HalfButton rounded filled onClick={withdraw}>
            Claim Now
          </HalfButton>
        </Row>
      </ModalBox>
    </Background>
  );
};

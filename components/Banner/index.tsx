import React, { useState, useEffect } from 'react';
import { useAuthContext, useModalContext, MODAL_TYPES } from '../Provider';
import { formatPrice } from '../../utils';
import { Background, Spacer, Money } from './Banner.styled';

const Banner = (): JSX.Element => {
  const { currentUser, atomicMarketBalance } = useAuthContext();
  const { openModal } = useModalContext();
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!atomicMarketBalance) return;

    const balance = parseFloat(atomicMarketBalance.replace(',', ''));
    console.log(currentUser);

    if (currentUser && balance > 0) {
      setIsBannerVisible(true);
    } else {
      setIsBannerVisible(false);
    }
  }, [currentUser, atomicMarketBalance]);

  if (!isBannerVisible) return null;

  return (
    <>
      <Spacer />
      <Background onClick={() => openModal(MODAL_TYPES.CLAIM)}>
        <Money role="img" aria-label="Money" right>
          💸
        </Money>
        Claim {formatPrice(atomicMarketBalance)} from sales
        <Money role="img" aria-label="Money">
          💸
        </Money>
      </Background>
    </>
  );
};

export default Banner;

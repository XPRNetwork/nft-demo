import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext, useModalContext, MODAL_TYPES } from '../Provider';
import { Background, Money } from './Banner.styled';
import { formatPrice } from '../../utils';

const Banner = (): JSX.Element => {
  const { atomicMarketBalance } = useAuthContext();
  const router = useRouter();
  const { openModal } = useModalContext();
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(false);
  const path = router.pathname.split('/')[1];

  useEffect(() => {
    if (!atomicMarketBalance) return;

    const balance = parseFloat(atomicMarketBalance.replace(',', ''));

    if (path === 'my-nfts' && balance > 0) {
      setIsBannerVisible(true);
    } else {
      setIsBannerVisible(false);
    }
  }, [path, atomicMarketBalance]);

  if (!isBannerVisible) return null;

  return (
    <Background onClick={() => openModal(MODAL_TYPES.CLAIM)}>
      <Money role="img" aria-label="Money" right>
        💸
      </Money>
      Claim {formatPrice(atomicMarketBalance)} from sales
      <Money role="img" aria-label="Money">
        💸
      </Money>
    </Background>
  );
};

export default Banner;

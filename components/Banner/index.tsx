import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext, useModalContext, MODAL_TYPES } from '../Provider';
import { Background } from './Banner.styled';

const Banner = (): JSX.Element => {
  const { currentUserBalance } = useAuthContext();
  const router = useRouter();
  const { openModal } = useModalContext();
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(false);
  const path = router.pathname.split('/')[1];

  useEffect(() => {
    if (!currentUserBalance) return;

    const balance = parseInt(currentUserBalance.match(/\d/g)[0]);

    if (path === 'my-nfts' && balance > 0) {
      setIsBannerVisible(true);
    } else {
      setIsBannerVisible(false);
    }
  }, [path, currentUserBalance]);

  if (!isBannerVisible) return null;

  return (
    <Background onClick={() => openModal(MODAL_TYPES.CLAIM)}>
      <span className="money" role="img" aria-label="Money">
        💸
      </span>
      Claim {currentUserBalance} from sales
      <span className="money" role="img" aria-label="Money">
        💸
      </span>
    </Background>
  );
};

export default Banner;

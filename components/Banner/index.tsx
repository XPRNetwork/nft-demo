import React, { useState, useEffect } from 'react';
import { useAuthContext, useModalContext, MODAL_TYPES } from '../Provider';
import { formatPrice } from '../../utils';
import Tooltip from '../Tooltip';
import { Background, Spacer, Content, Money } from './Banner.styled';

const Banner = (): JSX.Element => {
  const { currentUser, atomicMarketBalance } = useAuthContext();
  const { openModal } = useModalContext();
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!atomicMarketBalance) return;

    const balance = parseFloat(atomicMarketBalance.replace(/[,]/g, ''));

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
      <Tooltip content="We have updated the withdrawal / deposits system. This is the amount of unclaimed FOOBAR left in your account prior to the change. Please click to claim before the end date!">
        <Background onClick={() => openModal(MODAL_TYPES.CLAIM)}>
          <Content>
            <Money role="img" aria-label="Money" right>
              💸
            </Money>
            Claim {formatPrice(atomicMarketBalance)} from sales (only available
            until 3/29 12pm PDT)
            <Money role="img" aria-label="Money">
              💸
            </Money>
          </Content>
        </Background>
      </Tooltip>
    </>
  );
};

export default Banner;

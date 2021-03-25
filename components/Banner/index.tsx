import React, { useState, useEffect } from 'react';
import { useAuthContext, useModalContext } from '../Provider';
import Tooltip from '../Tooltip';
import { Background, Spacer, Content } from './Banner.styled';

type Props = {
  useTooltip?: boolean;
  toolTipContent?: string;
  bannerContent: string;
  modalType: string;
};

const Banner = ({
  useTooltip,
  toolTipContent,
  bannerContent,
  modalType,
}: Props): JSX.Element => {
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

  const getContent = () => {
    return (
      <Background onClick={() => openModal(modalType)}>
        <Content>{bannerContent}</Content>
      </Background>
    );
  };

  if (!isBannerVisible) return null;

  return (
    <>
      <Spacer />
      {useTooltip ? (
        <Tooltip content={toolTipContent}>{getContent()}</Tooltip>
      ) : (
        getContent()
      )}
    </>
  );
};

export default Banner;

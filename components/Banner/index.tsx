import React, { useState, useEffect } from 'react';
import { useAuthContext, useModalContext } from '../Provider';
import Tooltip from '../Tooltip';
import { Background, Spacer, Content } from './Banner.styled';

type Props = {
  toolTipContent?: string;
  bannerContent: string;
  modalType: string;
};

const Banner = ({
  toolTipContent,
  bannerContent,
  modalType,
}: Props): JSX.Element => {
  const { currentUser } = useAuthContext();
  const { openModal } = useModalContext();
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setIsBannerVisible(true);
    } else {
      setIsBannerVisible(false);
    }
  }, [currentUser]);

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
      {toolTipContent ? (
        <Tooltip content={toolTipContent}>{getContent()}</Tooltip>
      ) : (
        getContent()
      )}
    </>
  );
};

export default Banner;

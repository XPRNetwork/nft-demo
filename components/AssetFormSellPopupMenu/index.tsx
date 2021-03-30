import { useState } from 'react';
import {
  MenuContainer,
  PopupMenuButton,
  Menu,
  MenuItem,
} from './AssetFormSellPopupMenu.styled';
import { GradientBackground } from '../NavBar/NavBar.styled';
import { ReactComponent as Ellipsis } from '../../public/ellipsis.svg';
import {
  useModalContext,
  MODAL_TYPES,
  CreateMultipleSalesModalProps,
  CancelMultipleSalesModalProps,
} from '../Provider';
import { useScrollLock, useEscapeKeyClose } from '../../hooks';

const AssetFormSellPopupMenu = (): JSX.Element => {
  const { openModal, modalProps } = useModalContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const togglePopupMenu = () => setIsOpen(!isOpen);
  const closePopupMenu = () => setIsOpen(false);
  const { saleIds } = modalProps as CancelMultipleSalesModalProps;
  const { assetIds } = modalProps as CreateMultipleSalesModalProps;
  useScrollLock(isOpen);
  useEscapeKeyClose(closePopupMenu);

  const popupMenuItems = [
    {
      isHidden: !assetIds || assetIds.length === 0,
      name: 'Mark all for sale',
      onClick: () => {
        setIsOpen(false);
        openModal(MODAL_TYPES.CREATE_MULTIPLE_SALES);
      },
    },
    {
      isHidden: !saleIds || saleIds.length === 0,
      name: 'Cancel all sales',
      onClick: () => {
        setIsOpen(false);
        openModal(MODAL_TYPES.CANCEL_MULTIPLE_SALES);
      },
    },
  ];

  return (
    <MenuContainer>
      <PopupMenuButton onClick={togglePopupMenu}>
        <Ellipsis />
      </PopupMenuButton>
      <Menu isOpen={isOpen}>
        {popupMenuItems.map(({ isHidden, name, onClick }) => {
          if (!isHidden) {
            return (
              <MenuItem key={name} tabIndex={0} onClick={onClick}>
                {name}
              </MenuItem>
            );
          }
        })}
      </Menu>
      <GradientBackground
        isTransparent
        isOpen={isOpen}
        onClick={closePopupMenu}
      />
    </MenuContainer>
  );
};

export default AssetFormSellPopupMenu;

import { useState } from 'react';
import {
  MenuContainer,
  PopupMenuButton,
  Menu,
  MenuItem,
} from './AssetFormSellPopupMenu.styled';
import { GradientBackground } from '../NavBar/NavBar.styled';
import { ReactComponent as Ellipsis } from '../../public/ellipsis.svg';
import { useModalContext, MODAL_TYPES } from '../Provider';
import { useScrollLock, useEscapeKeyClose } from '../../hooks';

const AssetFormSellPopupMenu = (): JSX.Element => {
  const { openModal } = useModalContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const togglePopupMenu = () => setIsOpen(!isOpen);
  const closePopupMenu = () => setIsOpen(false);
  useScrollLock(isOpen);
  useEscapeKeyClose(closePopupMenu);

  const popupMenuItems = [
    {
      name: 'Mark all for sale',
      onClick: () => {
        setIsOpen(false);
        openModal(MODAL_TYPES.CREATE_MULTIPLE_SALES);
      },
    },
    {
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
        {popupMenuItems.map(({ name, onClick }) => (
          <MenuItem key={name} tabIndex={0} onClick={onClick}>
            {name}
          </MenuItem>
        ))}
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

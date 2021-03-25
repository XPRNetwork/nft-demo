import { useState } from 'react';
import {
  MenuContainer,
  PopupMenuButton,
  Menu,
  MenuItem,
} from './AssetFormSellPopupMenu.styled';
import { ReactComponent as Ellipsis } from '../../public/ellipsis.svg';
import { useModalContext, MODAL_TYPES } from '../Provider';

const AssetFormSellPopupMenu = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const togglePopupMenu = () => setIsOpen(!isOpen);
  const { openModal } = useModalContext();

  const popupMenuItems = [
    {
      name: 'Mark all for sale',
      onClick: () => openModal(MODAL_TYPES.CREATE_MULTIPLE_SALES),
    },
    {
      name: 'Cancel all sales',
      onClick: () => openModal(MODAL_TYPES.CANCEL_MULTIPLE_SALES),
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
    </MenuContainer>
  );
};

export default AssetFormSellPopupMenu;

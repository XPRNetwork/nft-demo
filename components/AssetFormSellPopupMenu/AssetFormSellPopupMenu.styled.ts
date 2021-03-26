import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

type MenuProps = {
  isOpen: boolean;
};

export const MenuContainer = styled.div`
  position: relative;
`;

export const PopupMenuButton = styled.button`
  background: none;
  outline: none;
  border: 1px solid #e6e6e6;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  text-align: center;
  cursor: pointer;
  transition: 0.2s;

  :hover,
  :focus-visible {
    background: #efefef;
  }
`;

export const Menu = styled.ul<MenuProps>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 50px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 12px 20px -4px rgba(0, 0, 0, 0.1), 0 0 8px 0 rgba(0, 0, 0, 0.08);
  width: 224px;
  z-index: 2;

  ${breakpoint.tablet`
    left: -235px;
  `}
`;

export const MenuItem = styled.li`
  line-height: 24px;
  padding: 8px 16px;
  cursor: pointer;
  transition: 0.2s;
  color: #0e103c;
  font-size: 16px;

  :hover,
  :focus-visible {
    color: #8a9ef5;
  }

  :first-of-type {
    margin-top: 16px;
  }

  :last-of-type {
    margin-bottom: 16px;
  }
`;

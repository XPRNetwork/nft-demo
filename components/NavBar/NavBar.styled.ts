import styled from 'styled-components';
import { MaxWidth } from '../../styles/MaxWidth.styled';
import { breakpoint } from '../../styles/Breakpoints';
import { FadeInImageContainer } from '../../styles/FadeInImageContainer.styled';

type DropdownProps = {
  isOpen: boolean;
};

type GradientBackgroundProps = {
  isOpen: boolean;
  isTransparent?: boolean;
};

type DropdownLinkProps = {
  red?: boolean;
};

type NavLinkProps = {
  isActive: boolean;
};

export const Background = styled.section`
  width: 100%;
  background: white;
  border-bottom: 1px solid #e8ecfd;
  z-index: 2;
  position: fixed;
  top: 0;
`;

export const Nav = styled(MaxWidth).attrs({ as: 'nav' })`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
`;

export const Section = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const UserMenuButton = styled.button`
  border-radius: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border: 1px solid #dde4ee;
  outline: none;
  background: none;
  padding: 0;
`;

export const UserMenuText = styled.span`
  color: #0e103c;
  font-size: 14px;
  margin: 8px 8px 8px 16px;
`;

export const AvatarContainer = styled(FadeInImageContainer)`
  width: 40px;
  height: 40px;
  position: relative;

  * {
    border-radius: 100%;
    z-index: 3;
  }

  ${breakpoint.tablet`
    margin: 0;
    width: 32px;
    height: 32px;
  `}
`;

export const ImageLink = styled.a`
  margin: 16px 0;
  z-index: 3;
`;

export const DropdownList = styled.section<DropdownProps>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 60px;
  right: 0;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 12px 20px -4px rgba(0, 0, 0, 0.1), 0 0 8px 0 rgba(0, 0, 0, 0.08);
  min-width: 224px;
  z-index: 2;

  ${breakpoint.tablet`
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    right: 0;
    z-index: 2;
    top: 65px;
    width: 100%;

    &:before {
      content: '';
      background: #ffffff;
      width: 100%;
      height: 350px;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
    }
  `}
`;

export const GradientBackground = styled.div<GradientBackgroundProps>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  z-index: 1;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  cursor: pointer;

  ${({ isTransparent }) =>
    !isTransparent &&
    `
    ${breakpoint.tablet`
      background-image: linear-gradient(
        rgba(14, 16, 60, 0.3),
        rgba(14, 16, 60, 0.4),
        rgba(14, 16, 60, 0.5),
        rgba(14, 16, 60, 0.6),
        rgba(14, 16, 60, 0.67)
      );
    `}
  `}
`;

export const Name = styled.span`
  font-family: GilroySemiBold;
  color: #0e103c;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  margin: 0 16px;
  padding: 16px 0 8px;

  ${breakpoint.tablet`
    border-top: 1px solid #dde4ee;
    margin: 0;
  `}
`;

export const Subtitle = styled.span`
  color: #7578b5;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  margin: 0 16px;

  ${breakpoint.tablet`
    margin: 0;
  `}
`;

export const Balance = styled(Name)`
  font-size: 18px;
  border-top: 0;
  border-bottom: 1px solid #dde4ee;
  margin: 0 16px;
  padding: 0 0 16px;

  ${breakpoint.tablet`
    margin: 0;
  `}
`;

export const DropdownLink = styled.a<DropdownLinkProps>`
  font-weight: 500;
  color: ${({ red }) => (red ? '#fb849a' : '#0e103c')};
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;
  padding: 16px 16px 0;
  width: 100%;
  transition: 0.2s;

  :last-of-type {
    padding-bottom: 16px;
  }

  :hover {
    color: ${({ red }) => (red ? '#ff002e' : '#7578b5')};
  }

  ${breakpoint.tablet`
    padding: 16px 0;
    border-bottom: 1px solid #dde4ee;

    :last-of-type {
      border: none;
    }
  `}
`;

export const DesktopOnlySection = styled.section`
  ${breakpoint.tablet`
    display: none;
  `}
`;

export const DesktopNavLink = styled.a<NavLinkProps>`
  color: ${({ isActive }) => (isActive ? '#7578b5' : '#0e103c')};
  font-weight: ${({ isActive }) => (isActive ? 600 : 500)};
  border-bottom: 2px solid ${({ isActive }) => (isActive ? '#8a9ef5' : 'white')};
  cursor: pointer;
  margin-right: 40px;
  font-size: 16px;
  padding: 21px 0;
  transition: 0.2s;

  :hover,
  :focus-visible {
    color: #7578b5;
    border-bottom: 2px solid #8a9ef5;
  }
`;

export const MobileIcon = styled.div`
  display: none;
  cursor: pointer;

  ${breakpoint.tablet`
    display: block;
  `}
`;

export const DesktopIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  ${breakpoint.tablet`
    display: none;
  `}
`;

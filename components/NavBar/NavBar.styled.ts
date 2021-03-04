import styled from 'styled-components';
import { MaxWidth } from '../../styles/MaxWidth.styled';
import { breakpoint } from '../../styles/Breakpoints';

type SectionProps = {
  isMobileNavOpen: boolean;
};

type NavLinkProps = {
  isActive: boolean;
};

export const Background = styled.section`
  width: 100%;
  background: white;
  border-bottom: 1px solid #e8ecfd;
  z-index: 2;
`;

export const Nav = styled(MaxWidth).attrs({ as: 'nav' })`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
`;

export const HamburgerContainer = styled.section`
  display: none;
  cursor: pointer;
  z-index: 3;

  ${breakpoint.tablet`
    display: block;
  `}
`;

export const ImageContainer = styled.section`
  margin: 16px 0;
  z-index: 3;
  ${breakpoint.tablet`
    width: 100%;
    display: flex;
    justify-content: center;
  `}
`;

export const Section = styled.section<SectionProps>`
  display: flex;
  justify-content: space-between;
  background: white;

  ${breakpoint.tablet`
    ${({ isMobileNavOpen }) =>
      isMobileNavOpen ? 'display: flex;' : 'display: none;'}

    flex-direction: column;
    width: 100%;
    position: absolute;
    top: 65px;
    z-index: 1;

    &:before {
      content: '';
      background: white;
      width: 100%;
      height: 246px;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
    }    
  `}
`;

export const GradientBackground = styled.section`
  display: none;

  ${breakpoint.tablet`
    display: block;
    z-index: 0;
    content: '';
    width: 100%;
    height: 100%;
    position: fixed;
    top: 246px;
    left: 0;
    z-index: -1;
    opacity: 0.7;
    background: #0e103c;
  `}
`;

export const NavLink = styled.a<NavLinkProps>`
  font-family: GilroyMedium;
  color: ${({ isActive }) => (isActive ? '#0e103c' : '#7578b5')};
  font-weight: ${({ isActive }) => (isActive ? 600 : 500)};
  border-bottom: 2px solid ${({ isActive }) => (isActive ? '#8a9ef5' : 'white')};
  cursor: pointer;
  margin-right: 40px;
  padding: 20px 0;
  font-size: 16px;
  line-height: 24px;

  ${breakpoint.tablet`
    margin-right: 0;
    border-bottom: 1px solid #dde4ee;
    padding: 16px 0;
  `}
`;

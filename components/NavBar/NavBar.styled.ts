import styled from 'styled-components';
import { MaxWidth } from '../../styles/MaxWidth.styled';

type NavLinkProps = {
  isActive: boolean;
};

export const NavBackground = styled.section`
  width: 100%;
  background: white;
  border-bottom: 1px solid #e8ecfd;
`;

export const Nav = styled(MaxWidth).attrs({ as: 'nav' })`
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const ImageContainer = styled.section`
  margin: 16px 0;
`;

export const Section = styled.section`
  display: flex;
  justify-content: space-between;
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
`;

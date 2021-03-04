import styled from 'styled-components';
import { MaxWidth } from '../../styles/MaxWidth.styled';

export const FooterBackground = styled.section`
  width: 100%;
  background: #f6f7fe;
  border-bottom: 1px solid #f6f7fe;
  position: fixed;
  bottom: 0;
`;

export const StyledFooter = styled(MaxWidth).attrs({ as: 'footer' })`
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const ImageContainer = styled.section`
  margin: 24px 0;
`;

export const Section = styled.section`
  display: flex;
  justify-content: space-between;
`;

export const FooterLink = styled.a`
  font-family: GilroyMedium;
  color: #7578b5;
  font-weight: 500;
  cursor: pointer;
  margin-right: 40px;
  padding: 20px 0;
  font-size: 16px;
  line-height: 24px;
`;

import styled from 'styled-components';
import { MaxWidth } from '../../styles/MaxWidth.styled';
import { breakpoint } from '../../styles/Breakpoints';
import { FadeInImageContainer } from '../../styles/FadeInImageContainer.styled';

export const FooterBackground = styled.footer`
  width: 100%;
  background: #f6f7fe;
  border-bottom: 1px solid #f6f7fe;
`;

export const StyledFooter = styled(MaxWidth).attrs({ as: 'section' })`
  justify-content: space-between;
  align-items: center;
  width: 100%;

  ${breakpoint.tablet`
    flex-direction: column;
    justify-content: center;
  `}
`;

export const ImageContainer = styled(FadeInImageContainer)`
  margin: 24px 0;
`;

export const Section = styled.section`
  display: flex;
  justify-content: space-between;

  ${breakpoint.tablet`
    flex-direction: column;
    justify-content: center;
  `}
`;

export const FooterLink = styled.a`
  color: #7578b5;
  font-weight: 500;
  cursor: pointer;
  margin-right: 40px;
  padding: 20px 0;
  font-size: 16px;
  line-height: 24px;
  text-align: center;

  ${breakpoint.tablet`
    padding: 0;
    margin: 0 0 16px;

    &:last-of-type {
      margin-bottom: 24px;
    }
  `}
`;

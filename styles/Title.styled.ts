import styled from 'styled-components';
import { breakpoint } from './Breakpoints';

export const Title = styled.h1`
  font-family: GilroySemiBold;
  font-size: 28px;
  line-height: 32px;
  color: #0e103c;
  margin: 48px 0;

  ${breakpoint.tablet`
    margin: 32px 0;
  `}
`;

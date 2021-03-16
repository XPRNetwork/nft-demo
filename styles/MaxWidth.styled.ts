import styled from 'styled-components';
import { breakpoint } from './Breakpoints';

export const MaxWidth = styled.div`
  max-width: 1128px;
  display: flex;
  justify-content: center;
  margin: 0px auto;

  ${breakpoint.laptop`
    max-width: 80%;
  `}

  ${breakpoint.tablet`
    max-width: 90%;
  `};

  ${breakpoint.mobile`
    max-width: 90%;
  `};
`;

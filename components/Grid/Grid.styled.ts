import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export const Container = styled.section`
  width: 100%;
  display: inline-grid;
  grid-column-gap: 16px;
  grid-row-gap: 48px;
  grid-template-columns: repeat(5, minmax(0, 1fr));

  ${breakpoint.laptop`
    grid-template-columns: repeat(3, minmax(0, 1fr));
  `}

  ${breakpoint.tablet`
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-column-gap: 10px;
  `}
`;

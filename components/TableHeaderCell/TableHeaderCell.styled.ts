import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export const StyledTableHeaderCell = styled.th`
  font-family: GilroyMedium;
  padding: 9px 0px;
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: 1px;
  color: #7578b5;
  text-align: left;

  ${breakpoint.mobile`
    padding: 9px 10px;
  `}
`;

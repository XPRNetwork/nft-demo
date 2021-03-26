import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export const StyledTableDataCell = styled.td`
  display: table-cell;
  vertical-align: middle;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #0e103c;
  text-align: 'left';

  ${breakpoint.mobile`
    padding: 0px 10px;
  `}
`;

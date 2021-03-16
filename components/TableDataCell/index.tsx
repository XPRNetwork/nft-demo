import { ReactNode } from 'react';
import { StyledTableDataCell } from './TableDataCell.styled';

type Props = {
  children: ReactNode;
};

const TableDataCell = ({ children }: Props): JSX.Element => {
  return <StyledTableDataCell>{children}</StyledTableDataCell>;
};

export default TableDataCell;

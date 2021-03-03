import styled from 'styled-components';
import Link from 'next/link';
import { MaxWidth } from '../../styles/MaxWidth.styled';

export const Container = styled(MaxWidth)`
  display: flex;
  width: 100%;
`;

export const NavLink = styled(Link)`
  display: inline;
  cursor: pointer;
  margin: 8px 0;
  padding-right: 16px;
`;

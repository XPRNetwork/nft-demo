import styled from 'styled-components';
import Image from 'next/image';
import { breakpoint } from '../../styles/Breakpoints';

export const AvatarImage = styled(Image)`
  border-radius: 100%;
`;

export const ImageDataCell = styled.td`
  vertical-align: middle;
  text-align: ${({ align }) => (align ? align : ' center')};

  ${breakpoint.mobile`
    padding: 0px 5px;
  `}
`;

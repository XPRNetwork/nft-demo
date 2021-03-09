import styled from 'styled-components';
import { MaxWidth } from '../../styles/MaxWidth.styled';
import { breakpoint } from '../../styles/Breakpoints';

export const Container = styled(MaxWidth)`
  flex-direction: column;
  margin: 64px auto 128px;
  width: 100%;
  overflow-y: scroll;

  ${breakpoint.tablet`
    margin-bottom: 64px;
  `}
`;

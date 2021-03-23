import styled from 'styled-components';
import { MaxWidth } from '../../styles/MaxWidth.styled';
import { breakpoint } from '../../styles/Breakpoints';

export const Main = styled.main`
  min-height: calc(100vh - 83px - 73px);

  ${breakpoint.tablet`
    min-height: calc(100vh - 250px - 66px);
    margin-top: 66px;
  `}
`;

export const Container = styled(MaxWidth)`
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 128px;

  ${breakpoint.tablet`
    margin-bottom: 64px;
  `}
`;

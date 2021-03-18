import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';
import { FadeInImageContainer } from '../../styles/FadeInImageContainer.styled';

type ArrowProps = {
  isActive: boolean;
};

type ToggleContainerProps = {
  active: boolean;
};

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 64px 100px 0px;

  ${breakpoint.tablet`
    margin: 64px 0 0;
  `};

  ${breakpoint.mobile`
    margin: 32px 0 0;
  `};
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
`;

export const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 64px 0 56px;

  ${breakpoint.mobile`
    margin: 0;
  `};
`;

export const ImageContainer = styled(FadeInImageContainer)`
  width: 100%;

  ${breakpoint.tablet`
    max-width: 294px;
  `};

  ${breakpoint.mobile`
    margin: 32px auto;
  `};
`;

export const Title = styled.h1`
  font-size: 22px;
  line-height: 32px;
  font-family: GilroySemiBold;
`;

export const Description = styled.p`
  color: #7578b5;
  max-width: 880px;
  font-family: GilroyMedium;
`;

export const Name = styled.h1`
  font-size: 40px;
  line-height: 48px;
  font-family: GilroySemiBold;
`;

export const Series = styled.p`
  font-size: 22px;
  color: #7578b5;
  line-height: 32px;
  margin-bottom: 16px;
  font-family: GilroyMedium;
`;

export const ContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 48px 0 16px;
`;

export const ArrowContainer = styled.div<ArrowProps>`
  transform: ${({ isActive }) =>
    isActive ? 'rotate(0deg)' : 'rotate(-180deg)'};
  -webkit-transform: ${({ isActive }) =>
    isActive ? 'rotate(0deg)' : 'rotate(-180deg)'};
  cursor: pointer;
`;

export const ToggleContainer = styled.div<ToggleContainerProps>`
  display: ${({ active }) => (active ? 'block' : 'none')};
  width: 100%;
`;

export const Serial = styled.p`
  line-height: 24px;
  margin-bottom: 8px;
  font-family: GilroyMedium;

  ${breakpoint.mobile`
    margin: 0;
  `};
`;

export const Divider = styled.div`
  margin: 12px 0 24px 0;
  border-bottom: 1px solid #e8ecfd;
`;

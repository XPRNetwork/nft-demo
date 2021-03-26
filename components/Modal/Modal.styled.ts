import styled from 'styled-components';
import { MaxWidth } from '../../styles/MaxWidth.styled';
import { breakpoint } from '../../styles/Breakpoints';
import { StyledButton, ButtonProps } from '../Button/Button.styled';

interface HalfButtonProps extends ButtonProps {
  color?: string;
  hoverColor?: string;
}

export const Background = styled.div`
  z-index: 3;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    rgba(14, 16, 60, 0.3),
    rgba(14, 16, 60, 0.4),
    rgba(14, 16, 60, 0.5),
    rgba(14, 16, 60, 0.6),
    rgba(14, 16, 60, 0.67)
  );
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export const ModalBox = styled(MaxWidth)`
  display: flex;
  flex-direction: column;
  margin-top: 232px;
  padding: 24px 24px 12px;
  border-radius: 8px;
  box-shadow: 0 8px 8px -4px rgba(0, 0, 0, 0.1), 0 0 4px 0 rgba(0, 0, 0, 0.08);
  background-color: #ffffff;

  @media (min-width: 600px) {
    max-width: 408px;
  }

  ${breakpoint.tablet`
    margin-top: 200px;
  `}
`;

export const Section = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const CloseIconContainer = styled.div`
  cursor: pointer;
`;

export const Title = styled.h1`
  font-family: GilroySemiBold;
  font-size: 24px;
  line-height: 32px;
  color: #0e103c;
  margin-bottom: 16px;
`;

export const Description = styled.p`
  font-size: 14px;
  line-height: 24px;
  color: #7578b5;
  margin-bottom: 24px;
`;

export const InputLabel = styled(Description).attrs({ as: 'label' })`
  font-size: 12px;
  line-height: 24px;
  display: flex;
  flex-direction: column;
  margin: 0;
`;

export const LinkDescription = styled(Description)`
  margin-bottom: 4px;
  text-align: center;
  font-size: 12px;
`;

export const WithdrawInputLabel = styled.p`
  display: flex;
  justify-content: space-between;
`;

export const AvailableBalance = styled.span`
  font-weight: 600;
  color: #8a9ef5;
`;

export const ErrorMessage = styled(Description).attrs({ as: 'span' })`
  font-size: 12px;
  color: red;
  margin-bottom: 0;
`;

export const Row = styled.div`
  display: flex;
`;

export const HalfButton = styled(StyledButton)<HalfButtonProps>`
  flex: 1;

  ${({ color }) =>
    color &&
    `
    background-color: ${color};
  `}

  ${({ hoverColor }) =>
    hoverColor &&
    `
    :hover {
      background-color: ${hoverColor};
    }
  `}
`;

export const Spacer = styled.div`
  flex: 1;
`;

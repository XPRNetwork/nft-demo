import styled from 'styled-components';
import { MaxWidth } from '../../styles/MaxWidth.styled';
import { breakpoint } from '../../styles/Breakpoints';

export const Background = styled.div`
  z-index: 2;
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
`;

export const ModalBox = styled(MaxWidth)`
  display: flex;
  flex-direction: column;
  margin-top: 15vh;
  padding: 24px 24px 12px;
  border-radius: 8px;
  box-shadow: 0 8px 8px -4px rgba(0, 0, 0, 0.1), 0 0 4px 0 rgba(0, 0, 0, 0.08);
  background-color: #ffffff;

  @media (min-width: 600px) {
    max-width: 408px;
  }

  ${breakpoint.tablet`
    margin-top: 7vh;
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
  font-family: GilroyMedium;
  font-size: 14px;
  line-height: 24px;
  color: #7578b5;
  margin-bottom: 32px;

  ${breakpoint.tablet`
    margin-bottom: 24px;
  `}
`;

export const InputLabel = styled(Description).attrs({ as: 'label' })`
  font-size: 12px;
  display: flex;
  flex-direction: column;
  margin-bottom: 3px;

  ${breakpoint.tablet`
    margin-bottom: 0;
  `}
`;

export const ErrorMessage = styled(Description).attrs({ as: 'span' })`
  font-size: 12px;
  color: red;
  margin-bottom: 0;
`;

export const Input = styled.input`
  font-family: GilroyMedium;
  font-size: 14px;
  line-height: 24px;
  color: #7578b5;
  border-radius: 4px;
  padding: 8px;
  border: solid 1px #e8ecfd;
  margin-bottom: 20px;

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }

  ::placeholder {
    color: #7578b5;
  }

  ${breakpoint.tablet`
    margin-bottom: 12px;
  `}
`;

export const ButtonContainer = styled.section`
  display: flex;
  justify-content: space-between;

  ${breakpoint.tablet`
    flex-direction: column-reverse;
  `}
`;

export const LinkButton = styled.button`
  font-family: GilroySemiBold;
  font-size: 14px;
  line-height: 24px;
  color: #8a9ef5;
  width: 100%;
  padding: 0;
  margin-right: 75px;
  border: none;
  background: none;
  text-decoration: underline;
  cursor: pointer;
  transition: 0.2s;

  :hover {
    color: #4d5dc1;
  }

  ${breakpoint.tablet`
    margin: 4px 0 12px;
  `}
`;

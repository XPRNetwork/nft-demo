import styled from 'styled-components';


export interface ButtonProps {
  filled?: boolean;
  rounded?: boolean;
  fullWidth?: boolean;
}

export const StyledButton = styled.button<ButtonProps>`
  padding: 8px 16px;
  margin: 12px 0;
  border-radius: ${({ rounded }) => (rounded ? '20px' : '4px')};
  border: ${({ filled }) => (filled ? 'none' : ' 1px solid #e8ecfd')};
  background-color: ${({ filled }) => (filled ? '#8a9ef5' : '#ffffff')};
  color: ${({ filled }) => (filled ? '#ffffff' : '#8a9ef5')};
  cursor: pointer;
  outline: none;
  transition: 0.2s;
  height: auto;
  font-size: 16px;
  line-height: 24px;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  :hover,
  :focus {
    opacity: 1;
    color: #ffffff;
    background-color: ${({ filled }) => (filled ? '#4d5dc1' : '#8a9ef5')};
    box-shadow: 0 8px 12px -4px rgba(130, 136, 148, 0.24),
      0 0 4px 0 rgba(141, 141, 148, 0.16), 0 0 2px 0 rgba(141, 141, 148, 0.12);
  }
`;

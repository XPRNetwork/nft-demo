import styled from 'styled-components';

export const StyledButton = styled.button`
  padding: 8px 16px;
  margin: 12px 0;
  border-radius: 20px;
  background-color: #8a9ef5;
  color: #ffffff;
  cursor: pointer;
  outline: none;
  border: none;
  transition: 0.2s;
  height: auto;
  font-size: 16px;
  line-height: 24px;
  font-family: GilroyMedium;

  :hover,
  :focus {
    opacity: 1;
    background-color: #4d5dc1;
    box-shadow: 0 8px 12px -4px rgba(130, 136, 148, 0.24),
      0 0 4px 0 rgba(141, 141, 148, 0.16), 0 0 2px 0 rgba(141, 141, 148, 0.12);
  }
`;

import styled from 'styled-components';

export const Input = styled.input`
  font-family: GilroyMedium;
  font-size: 14px;
  line-height: 24px;
  color: #7578b5;
  border-radius: 4px;
  padding: 8px;
  border: solid 1px #e8ecfd;
  margin-bottom: 12px;
  width: 100%;

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
`;

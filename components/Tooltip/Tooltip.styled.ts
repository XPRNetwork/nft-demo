import styled from 'styled-components';

export const Background = styled.div`
  position: fixed;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const Header = styled.h1`
  font-size: 16px;
  margin-bottom: 8px;
  font-family: GilroyMedium;
  color: red;
`;

export const Content = styled.div`
  font-family: GilroyMedium;
  font-size: 12px;
  color: #7578b5;
  flex-direction: column;
  max-width: 350px;
  padding: 8px;
  background-color: white;
  border: 1px solid #7578b5;
  border-radius: 4px;
  margin-top: 48px;
  position: absolute;

  ::before {
    content: '';
    position: relative;
    left: 50%;
    border: solid transparent;
    position: absolute;
    top: -14%;
    border-width: 5px;
    border-bottom-color: #7578b5;
  }
`;

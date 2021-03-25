import styled from 'styled-components';

export const Background = styled.div`
  position: fixed;
  left: 0;
  top: 64px;
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
  color: #7578b5;
  flex-direction: column;
  justify-content: center;
  max-width: 250px;
  padding: 8px;
  border: 1px solid #7578b5;
  font-size: 12px;
  border-radius: 4px;
  margin-top: 48px;
  position: absolute;

  ::before {
    content: '';
    position: relative;
    left: 50%;
    border: solid transparent;
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    top: -7%;
    border-bottom-color: #7578b5;
  }
`;

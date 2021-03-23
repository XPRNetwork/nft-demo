import styled from 'styled-components';

type MoneyProps = {
  right?: boolean;
};

export const Background = styled.section`
  position: fixed;
  top: 64px;
  width: 100%;
  height: 40px;
  background: #ebf4ee;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #75b587;
  font-size: 14px;
  font-family: GilroySemiBold;
  cursor: pointer;
  z-index: 3;
`;

export const Money = styled.span<MoneyProps>`
  font-size: 16px;
  margin-right: ${({ right }) => (right ? '8px' : '0')};
  margin-left: ${({ right }) => (!right ? '8px' : '0')};
`;

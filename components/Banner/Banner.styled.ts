import styled from 'styled-components';

type MoneyProps = {
  right?: boolean;
};

export const Background = styled.section`
  position: absolute;
  left: 0;
  width: 100%;
  height: 40px;
  background: #ebf4ee;
  z-index: 0;
`;

export const Content = styled.div`
  color: #75b587;
  font-size: 14px;
  font-family: GilroySemiBold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  z-index: 1;
`;

export const Money = styled.span<MoneyProps>`
  font-size: 16px;
  margin-right: ${({ right }) => (right ? '8px' : '0')};
  margin-left: ${({ right }) => (!right ? '8px' : '0')};
`;

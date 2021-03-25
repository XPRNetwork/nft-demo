import styled from 'styled-components';

type MoneyProps = {
  right?: boolean;
};

export const Background = styled.section`
  left: 0;
  width: 100%;
  height: 40px;
  background: #ebf4ee;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #75b587;
  position: fixed;
  font-size: 14px;
  font-family: GilroySemiBold;
  cursor: pointer;
`;

export const Spacer = styled.div`
  height: 40px;
`;

export const Money = styled.span<MoneyProps>`
  font-size: 16px;
  margin-right: ${({ right }) => (right ? '8px' : '0')};
  margin-left: ${({ right }) => (!right ? '8px' : '0')};
`;

export const Content = styled.span`
  position: relative;
  color: #75b587;
  font-size: 14px;
  font-family: GilroySemiBold;
`;

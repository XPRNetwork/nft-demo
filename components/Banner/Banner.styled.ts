import styled from 'styled-components';

type MoneyProps = {
  right?: boolean;
};

export const Background = styled.section`
  margin-top: 64px;
  margin-bottom: -73px;
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
`;

export const Money = styled.span<MoneyProps>`
  font-size: 16px;
  margin-right: ${({ right }) => (right ? '8px' : '0')};

  &:last-of-type {
    margin: 0 0 0 8px;
  }
`;

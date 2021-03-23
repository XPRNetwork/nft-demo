import styled from 'styled-components';

export const Background = styled.section`
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

  & .money {
    font-size: 16px;
    margin-right: 8px;

    &:last-of-type {
      margin: 0 0 0 8px;
    }
  }
`;

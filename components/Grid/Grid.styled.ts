import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export const Container = styled.section`
  width: 100%;
  display: inline-grid;
  grid-column-gap: 16px;
  grid-row-gap: 48px;
  grid-template-columns: repeat(5, minmax(0, 1fr));

  ${breakpoint.laptop`
    grid-template-columns: repeat(3, minmax(0, 1fr));
  `}

  ${breakpoint.tablet`
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-column-gap: 10px;
  `}
`;

export const EmptyContainer = styled.section`
  width: 100%;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const QuestionIcon = styled.div`
  font-family: GilroySemiBold;
  font-size: 50px;
  width: 94px;
  height: 94px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  color: #8a9ef5;
  background-color: #f1f3fe;
  border-radius: 35px;
  :before {
    content: '?';
  }
`;

export const Text = styled.p`
  font-family: GilroySemiBold;
  font-size: 18px;
  line-height: 24px;
  color: #0e103c;
  max-width: 280px;
  text-align: center;
  margin: 32px 0 20px;
`;

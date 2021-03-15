import styled from 'styled-components';

export const Serial = styled.p`
  line-height: 24px;
  margin-bottom: 8px;
  font-family: GilroyMedium;
`;

export const Divider = styled.div`
  margin: 12px 0 24px 0;
  border-bottom: 1px solid #e8ecfd;
`;

export const General = styled.p`
  color: #7578b5;
  font-size: 14px;
  line-height: 24px;
  font-family: GilroyMedium;
`;

export const Amount = styled.h3`
  font-size: 22px;
  font-weight: 600;
  line-height: 32px;
  margin-bottom: 16px;
  font-family: GilroyMedium;
`;

export const Input = styled.input`
  margin: 4px 0 24px;
  padding: 8px 16px;
  color: #aab2d5;
  border: 1px solid #aab2d5;
  border-radius: 4px;
  line-height: 24px;
  width: 100%;

  ::-webkit-input-placeholder {
    color: #aab2d5;
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
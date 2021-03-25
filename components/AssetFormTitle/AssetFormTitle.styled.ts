import styled from 'styled-components';

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Name = styled.h1`
  font-size: 40px;
  line-height: 48px;
  font-family: GilroySemiBold;
  margin-bottom: 8px;
`;

export const General = styled.p`
  color: #7578b5;
  font-size: 14px;
  line-height: 24px;
  font-family: GilroyMedium;
`;

export const CollectionName = styled(General)`
  margin-left: 8px;
  color: #0e103c;
`;

export const CollectionCreator = styled(General).attrs({ as: 'span' })`
  color: #8a9ef5;
`;

export const CollectionIconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

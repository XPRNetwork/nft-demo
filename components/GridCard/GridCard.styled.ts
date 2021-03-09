import styled from 'styled-components';

export const Container = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;

  img {
    transition: 0.3s;
  }

  :hover img {
    transform: scale(1.1);
  }
`;

export const ImageContainer = styled.div`
  position: relative;
`;

export const Text = styled.span`
  font-family: GilroySemiBold;
  font-size: 16px;
  line-height: 24px;
  color: #0e103c;
  margin-top: 16px;
`;

export const SecondaryText = styled.span`
  font-family: GilroyMedium;
  font-size: 16px;
  line-height: 24px;
  color: #7578b5;
`;

export const Price = styled(Text)`
  font-size: 18px;
  line-height: 32px;
  margin-top: 8px;
`;

export const Tag = styled.div`
  font-family: GilroySemiBold;
  font-size: 12px;
  line-height: 24px;
  position: absolute;
  bottom: 0;
  margin: 10px;
  padding: 2px 12px;
  opacity: 0.6;
  border-radius: 4px;
  background-color: #0e103c;
  color: #ffffff;
`;

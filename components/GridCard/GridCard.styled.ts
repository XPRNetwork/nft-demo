import styled, { keyframes } from 'styled-components';

const placeHolderShimmer = keyframes`
  0%{
    background-position: -500px 0
  }
  100%{
    background-position: 500px 0
  }
`;

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

export const EmptyPrice = styled.div`
  margin: 15px 0 7px;
  height: 18px;
  width: 50%;
`;

export const ShimmerBlock = styled(EmptyPrice)`
  animation: ${placeHolderShimmer} 1s linear infinite;
  background: linear-gradient(to right, #eeeeee 8%, #e7e7e7 18%, #eeeeee 33%);
  background-size: 1000px 18px;
`;
